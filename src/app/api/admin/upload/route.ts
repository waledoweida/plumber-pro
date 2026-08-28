import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX = 4 * 1024 * 1024; // 4MB

function validateMagic(buf: Buffer): boolean {
  const jpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const png = buf[0] === 0x89 && buf[1] === 0x50;
  const gif = buf[0] === 0x47 && buf[1] === 0x49;
  const webp = buf.length > 11 && buf[8] === 0x57 && buf[9] === 0x45;
  return jpeg || png || gif || webp;
}

async function uploadVercelBlob(buf: Buffer, filename: string, contentType: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const { put } = await import("@vercel/blob");
  const blob = await put(`uploads/${filename}`, buf, {
    access: "public",
    contentType,
    token,
  });
  return blob.url;
}

async function uploadCloudinary(buf: Buffer, filename: string, contentType: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) return null;

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buf)], { type: contentType }), filename);
  form.append("upload_preset", preset);
  form.append("folder", "plumber-pro");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("cloudinary error", err);
    return null;
  }
  const data = await res.json();
  return data.secure_url as string;
}

async function uploadLocal(buf: Buffer, filename: string) {
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buf);
  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "اختر ملف صورة" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "الصيغ المدعومة: JPG, PNG, WebP, GIF" }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "أقصى حجم 4 ميجابايت" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (!validateMagic(buf)) {
      return NextResponse.json({ error: "الملف ليس صورة صالحة" }, { status: 400 });
    }

    const ext = EXT[file.type] || "jpg";
    const filename = `${randomUUID()}.${ext}`;

    // 1) Vercel Blob (إنتاج على Vercel)
    let url = await uploadVercelBlob(buf, filename, file.type);
    if (url) {
      return NextResponse.json({ url, storage: "vercel-blob" });
    }

    // 2) Cloudinary (أي استضافة)
    url = await uploadCloudinary(buf, filename, file.type);
    if (url) {
      return NextResponse.json({ url, storage: "cloudinary" });
    }

    // 3) محلي (تطوير فقط — على Vercel القرص غير دائم)
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "ارفع الصورة مباشرة يحتاج إعداد تخزين. أضف BLOB_READ_WRITE_TOKEN من Vercel أو CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET. شوف DEPLOY.md",
        },
        { status: 503 }
      );
    }

    url = await uploadLocal(buf, filename);
    return NextResponse.json({ url, storage: "local" });
  } catch (e) {
    console.error("upload error", e);
    return NextResponse.json({ error: "فشل رفع الصورة. جرّب صورة أصغر أو صيغة JPG/PNG." }, { status: 500 });
  }
}
