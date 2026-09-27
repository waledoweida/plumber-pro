// عنوان القسم: محاذاة للبداية مع شريط نحاسي (أو بالنص لو center)
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-9 sm:mb-12 ${center ? "text-center" : "text-start"} max-w-3xl ${center ? "mx-auto" : ""}`}>
      {eyebrow && <span className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</span>}
      <h2 className={`text-2xl sm:text-4xl font-bold mt-2 mb-3 leading-tight ${light ? "text-white" : "text-brand-950"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm sm:text-base leading-relaxed ${light ? "text-brand-100" : "text-slate-600"}`}>{subtitle}</p>
      )}
    </div>
  );
}
