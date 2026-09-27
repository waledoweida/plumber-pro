import Link from "next/link";
import type { ReactNode } from "react";

// تنسيق بسيط وآمن لمحتوى المقالات (بدون HTML خام):
//   ## عنوان رئيسي      ### عنوان فرعي
//   - عنصر قائمة        1. قائمة مرقّمة
//   > ملاحظة مميّزة     ![وصف الصورة](/images/x.webp)
//   **نص عريض**         [نص الرابط](/services/pipes)
//   | جدول | بأعمدة |    (السطر الثاني |---|---|)
// النص العادي بدون أي رموز بيظهر زي ما هو (المقالات القديمة ما بتتأثرش).

export type Heading = { id: string; text: string };

const stripInline = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export const headingId = (text: string, i: number) =>
  "h-" + (stripInline(text).trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60) || i);

// صور المقالات المحلية ليها نسخة 800px للموبايل
export function responsive(src: string) {
  if (!/^\/images\/articles\/[\w-]+\.webp$/.test(src) || src.endsWith("-800.webp")) return {};
  return {
    srcSet: `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} 1200w`,
    sizes: "(max-width: 800px) 100vw, 768px",
  };
}

const safeHref = (u: string) => /^(\/(?!\/)|https:\/\/|tel:|mailto:)/.test(u);

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={k} className="font-bold text-slate-900">{m[1]}</strong>);
    } else {
      const [label, href] = [m[2], m[3]];
      if (!safeHref(href)) out.push(label);
      else if (href.startsWith("/"))
        out.push(<Link key={k} href={href} className="text-accent-600 font-semibold underline underline-offset-4 decoration-accent-300 hover:decoration-accent-600">{label}</Link>);
      else
        out.push(<a key={k} href={href} target="_blank" rel="noopener noreferrer" className="text-brand-700 font-semibold underline underline-offset-4">{label}</a>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const withBreaks = (lines: string[], key: string) =>
  lines.flatMap((l, i) => (i ? [<br key={`${key}-br${i}`} />, ...inline(l, `${key}-${i}`)] : inline(l, `${key}-${i}`)));

export function parseHeadings(content: string): Heading[] {
  return content
    .split(/\r?\n/)
    .filter((l) => /^##\s+/.test(l))
    .map((l, i) => ({ id: headingId(l.replace(/^##\s+/, ""), i), text: stripInline(l.replace(/^##\s+/, "")) }));
}

export function readingMinutes(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 180));
}

export function renderArticle(content: string): ReactNode[] {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  const nodes: ReactNode[] = [];
  let h2 = 0;
  blocks.forEach((raw, bi) => {
    const lines = raw.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim());
    if (!lines.length) return;
    const key = `b${bi}`;
    const first = lines[0];

    const img = lines.length === 1 && first.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img && safeHref(img[2])) {
      nodes.push(
        <figure key={key} className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img[2]}
            {...responsive(img[2])}
            alt={img[1]}
            loading="lazy"
            decoding="async"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg border border-slate-200 bg-white"
          />
        </figure>
      );
      return;
    }
    if (/^##\s+/.test(first) && lines.length === 1) {
      const text = first.replace(/^##\s+/, "");
      nodes.push(<h2 key={key} id={headingId(text, h2++)} className="scroll-mt-24 text-xl sm:text-2xl font-bold text-brand-950 mt-10 mb-4 border-b border-slate-200 pb-2">{inline(text, key)}</h2>);
      return;
    }
    if (/^###\s+/.test(first) && lines.length === 1) {
      nodes.push(<h3 key={key} className="text-lg sm:text-xl font-bold text-slate-900 mt-7 mb-3">{inline(first.replace(/^###\s+/, ""), key)}</h3>);
      return;
    }
    if (lines.every((l) => /^[-•]\s+/.test(l))) {
      nodes.push(
        <ul key={key} className="my-4 space-y-2 ps-5 list-disc marker:text-accent-500">
          {lines.map((l, i) => <li key={i}>{inline(l.replace(/^[-•]\s+/, ""), `${key}-${i}`)}</li>)}
        </ul>
      );
      return;
    }
    if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
      nodes.push(
        <ol key={key} className="my-4 space-y-2 ps-5 list-decimal marker:font-bold marker:text-accent-600">
          {lines.map((l, i) => <li key={i}>{inline(l.replace(/^\d+[.)]\s+/, ""), `${key}-${i}`)}</li>)}
        </ol>
      );
      return;
    }
    if (lines.length >= 3 && lines.every((l) => /^\|.*\|$/.test(l.trim())) && /^\|[\s:|-]+\|$/.test(lines[1].trim())) {
      const cells = (l: string) => l.trim().slice(1, -1).split("|").map((c) => c.trim());
      const head = cells(lines[0]);
      nodes.push(
        <div key={key} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 bg-white">
            <thead className="bg-brand-950 text-white">
              <tr>{head.map((c, i) => <th key={i} className="text-start font-bold px-4 py-3">{inline(c, `${key}-h${i}`)}</th>)}</tr>
            </thead>
            <tbody>
              {lines.slice(2).map((l, r) => (
                <tr key={r} className="border-t border-slate-200 even:bg-slate-50">
                  {cells(l).map((c, i) => <td key={i} className="px-4 py-3 align-top">{inline(c, `${key}-${r}-${i}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      return;
    }
    if (lines.every((l) => /^>\s?/.test(l))) {
      nodes.push(
        <blockquote key={key} className="my-6 border-s-4 border-accent-500 bg-accent-50 px-5 py-4 text-slate-800">
          {withBreaks(lines.map((l) => l.replace(/^>\s?/, "")), key)}
        </blockquote>
      );
      return;
    }
    nodes.push(<p key={key} className="my-4">{withBreaks(lines, key)}</p>);
  });
  return nodes;
}
