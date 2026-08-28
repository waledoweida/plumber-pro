import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const c = clearSessionCookie();
  res.cookies.set(c.name, c.value, {
    httpOnly: c.httpOnly,
    path: c.path,
    maxAge: c.maxAge,
  });
  return res;
}
