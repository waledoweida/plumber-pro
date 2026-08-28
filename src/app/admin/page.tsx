"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock, Settings, Type, Eye, Wrench, ListChecks, Save, LogOut,
  LayoutDashboard, Plus, Trash2, MapPin, Menu, X, Check, MessageSquare,
  Star, Image as ImageIcon, FileText, Inbox,
} from "lucide-react";

type Tab =
  | "dash" | "leads" | "settings" | "texts" | "visibility"
  | "services" | "areas" | "why" | "reviews" | "gallery" | "articles";

const TEXT_LABELS: Record<string, string> = {
  "home.heroBadge": "شارة الهيرو",
  "home.heroTitle": "عنوان الهيرو",
  "home.heroSubtitle": "عنوان فرعي",
  "home.heroDesc": "وصف الهيرو",
  "home.btnCall": "زر اتصال",
  "home.btnWhatsapp": "زر واتساب",
  "home.formTitle": "عنوان نموذج الطلب",
  "home.servicesTitle": "عنوان الخدمات",
  "home.servicesSubtitle": "وصف الخدمات",
  "home.servicesMore": "رابط تفاصيل",
  "home.reviewsTitle": "عنوان الآراء",
  "home.galleryTitle": "عنوان المعرض",
  "home.whyTitle": "عنوان لماذا نحن",
  "home.whyDesc": "وصف لماذا نحن",
  "home.whyBtn": "زر اطلب خدمة",
  "home.areasEyebrow": "شريط المناطق",
  "home.areasTitle": "عنوان المناطق",
  "home.areasSubtitle": "وصف المناطق",
  "home.blogTitle": "عنوان المدونة في الرئيسية",
  "home.ctaTitle": "عنوان CTA",
  "home.ctaDesc": "وصف CTA",
  "home.ctaWhatsapp": "واتساب CTA",
  "nav.home": "قائمة: الرئيسية",
  "nav.services": "قائمة: الخدمات",
  "nav.about": "قائمة: من نحن",
  "nav.blog": "قائمة: المدونة",
  "nav.contact": "قائمة: اتصل بنا",
  "nav.call": "زر اتصل",
  "nav.tagline": "شعار تحت الاسم",
  "footer.servicesTitle": "فوتر خدمات",
  "footer.contactTitle": "فوتر تواصل",
  "footer.rights": "حقوق",
  "page.servicesTitle": "صفحة الخدمات",
  "page.aboutTitle": "صفحة من نحن",
  "page.aboutBody": "نص من نحن",
  "page.contactTitle": "صفحة اتصل",
  "page.contactCta": "طلب فوري",
  "page.blogTitle": "عنوان المدونة",
  "page.backToServices": "عودة للخدمات",
  "label.phone": "تسمية هاتف",
  "label.email": "تسمية بريد",
  "label.address": "تسمية عنوان",
  "label.hours": "تسمية وقت",
};

const VIS_LABELS: Record<string, string> = {
  showHero: "الهيرو",
  showLeadForm: "نموذج الطلب",
  showServices: "الخدمات",
  showReviews: "آراء العملاء",
  showGallery: "معرض الأعمال",
  showWhy: "لماذا تختارنا",
  showAreas: "المناطق",
  showBlog: "المدونة في الرئيسية",
  showCta: "الدعوة للإجراء",
  showFloating: "أزرار عائمة",
};

const SETTINGS_KEYS = ["name", "tagline", "phone", "whatsapp", "email", "address", "hours", "description"] as const;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<Tab>("dash");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [vis, setVis] = useState<Record<string, boolean>>({});
  const [services, setServices] = useState<any[]>([]);
  const [why, setWhy] = useState<string[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [editSvc, setEditSvc] = useState<any | null>(null);
  const [editArea, setEditArea] = useState<any | null>(null);
  const [editReview, setEditReview] = useState<any | null>(null);
  const [editGallery, setEditGallery] = useState<any | null>(null);
  const [editArticle, setEditArticle] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const loadAll = useCallback(async () => {
    const [s, t, v, sv, w, ar, ld, rv, gal, art] = await Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/texts").then((r) => r.json()),
      fetch("/api/admin/visibility").then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/why").then((r) => r.json()),
      fetch("/api/admin/areas").then((r) => r.json()),
      fetch("/api/admin/leads").then((r) => r.json()),
      fetch("/api/admin/reviews").then((r) => r.json()),
      fetch("/api/admin/gallery").then((r) => r.json()),
      fetch("/api/admin/articles").then((r) => r.json()),
    ]);
    setSettings(s || {});
    setTexts(t || {});
    setVis(v || {});
    setServices(Array.isArray(sv) ? sv : []);
    setWhy(Array.isArray(w) ? w.map((x: any) => x.text) : []);
    setAreas(Array.isArray(ar) ? ar : []);
    setLeads(Array.isArray(ld) ? ld : []);
    setReviews(Array.isArray(rv) ? rv : []);
    setGallery(Array.isArray(gal) ? gal : []);
    setArticles(Array.isArray(art) ? art : []);
  }, []);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => {
      if (r.ok) {
        setAuthed(true);
        loadAll();
      }
    });
  }, [loadAll]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      loadAll();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "كلمة المرور غير صحيحة");
    }
  };

  const save = async (path: string, body: any, method = "PUT") => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMsg("تم الحفظ — يظهر على الموقع فورًا");
        setTimeout(() => setMsg(""), 3000);
        return true;
      }
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "فشل الحفظ");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  const uploadImage = async (file: File, onUrl: (url: string) => void) => {
    if (file.size > 4 * 1024 * 1024) {
      setMsg("أقصى حجم 4 ميجا");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (r.ok && d.url) {
        onUrl(d.url);
        setMsg("تم رفع الصورة");
      } else setMsg(d.error || "فشل الرفع");
    } catch {
      setMsg("فشل الاتصال");
    } finally {
      setUploading(false);
    }
  };

  const tabs: { id: Tab; label: string; short: string; icon: any }[] = [
    { id: "dash", label: "نظرة عامة", short: "عامة", icon: LayoutDashboard },
    { id: "leads", label: "طلبات العملاء", short: "طلبات", icon: Inbox },
    { id: "settings", label: "بيانات الشركة", short: "بيانات", icon: Settings },
    { id: "texts", label: "النصوص", short: "نصوص", icon: Type },
    { id: "visibility", label: "إظهار/إخفاء", short: "إظهار", icon: Eye },
    { id: "services", label: "الخدمات", short: "خدمات", icon: Wrench },
    { id: "areas", label: "المناطق", short: "مناطق", icon: MapPin },
    { id: "reviews", label: "آراء العملاء", short: "آراء", icon: Star },
    { id: "gallery", label: "معرض الأعمال", short: "معرض", icon: ImageIcon },
    { id: "articles", label: "المدونة", short: "مقالات", icon: FileText },
    { id: "why", label: "لماذا نحن", short: "تميز", icon: ListChecks },
  ];

  const currentTab = tabs.find((x) => x.id === tab)!;
  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-base outline-none focus:border-brand-500";

  if (!authed) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-b from-brand-900 to-brand-800">
        <form onSubmit={login} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 rounded-2xl px-4 py-3.5 text-base"
            placeholder="كلمة المرور"
            autoFocus
          />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button type="submit" className="w-full bg-brand-700 text-white font-bold py-3.5 rounded-2xl">
            دخول
          </button>
        </form>
      </div>
    );
  }

  const SaveBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      disabled={saving}
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm min-h-[44px] disabled:opacity-50"
    >
      <Save className="w-4 h-4" />
      {saving ? "..." : "حفظ"}
    </button>
  );

  const ImgUpload = ({ onUrl }: { onUrl: (u: string) => void }) => (
    <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-brand-300 bg-brand-50 text-brand-800 font-bold py-3 rounded-2xl cursor-pointer text-sm">
      {uploading ? "جاري الرفع..." : "📷 اختر صورة من الجهاز"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f, onUrl);
          e.target.value = "";
        }}
      />
    </label>
  );

  /* ---- panels ---- */
  let panel: React.ReactNode = null;

  if (tab === "dash") {
    panel = (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { n: leads.filter((l) => l.status === "new").length, l: "طلب جديد" },
          { n: services.length, l: "خدمة" },
          { n: reviews.length, l: "رأي" },
          { n: articles.length, l: "مقال" },
        ].map((x, i) => (
          <div key={i} className="bg-white rounded-2xl border p-4">
            <div className="text-2xl font-bold text-brand-800">{x.n}</div>
            <div className="text-xs text-slate-500">{x.l}</div>
          </div>
        ))}
        <a href="/" target="_blank" className="col-span-2 lg:col-span-4 text-center bg-brand-50 border border-brand-200 rounded-2xl py-3 font-bold text-brand-800">
          عرض الموقع ↗
        </a>
      </div>
    );
  }

  if (tab === "leads") {
    panel = (
      <div className="space-y-2">
        {leads.length === 0 && <p className="text-slate-400 text-center py-8">لا طلبات بعد</p>}
        {leads.map((l) => (
          <div key={l.id} className="bg-white rounded-2xl border p-4 space-y-1">
            <div className="flex justify-between gap-2">
              <span className="font-bold">{l.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${l.status === "new" ? "bg-amber-100 text-amber-800" : "bg-slate-100"}`}>
                {l.status}
              </span>
            </div>
            <a href={`tel:${l.phone}`} className="text-brand-700 font-semibold text-sm">
              {l.phone}
            </a>
            <div className="text-xs text-slate-500">
              {l.area} {l.service && `• ${l.service}`}
            </div>
            {l.message && <p className="text-sm text-slate-600">{l.message}</p>}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="text-xs bg-brand-50 text-brand-800 px-3 py-1.5 rounded-lg font-medium"
                onClick={async () => {
                  await save("/api/admin/leads", { id: l.id, status: "done" });
                  loadAll();
                }}
              >
                تم التعامل
              </button>
              <button
                type="button"
                className="text-xs text-red-500 px-2"
                onClick={async () => {
                  if (confirm("حذف؟")) {
                    await save("/api/admin/leads", { id: l.id }, "DELETE");
                    loadAll();
                  }
                }}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "settings") {
    panel = (
      <div className="space-y-3">
        <div className="flex justify-end"><SaveBtn onClick={() => save("/api/admin/settings", settings)} /></div>
        <div className="bg-white rounded-2xl border divide-y">
          {SETTINGS_KEYS.map((k) => (
            <div key={k} className="p-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1">{k}</label>
              {k === "description" ? (
                <textarea className={inputCls} rows={3} value={settings[k] || ""} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} />
              ) : (
                <input className={inputCls} value={settings[k] || ""} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "texts") {
    const keys = Array.from(new Set([...Object.keys(TEXT_LABELS), ...Object.keys(texts)])).sort();
    panel = (
      <div className="space-y-3">
        <div className="flex justify-end"><SaveBtn onClick={() => save("/api/admin/texts", texts)} /></div>
        <div className="bg-white rounded-2xl border divide-y max-h-[70vh] overflow-y-auto">
          {keys.map((k) => (
            <div key={k} className="p-4">
              <label className="text-xs font-semibold text-slate-500 block mb-1">{TEXT_LABELS[k] || k}</label>
              <textarea
                className={inputCls}
                rows={(texts[k] || "").length > 40 ? 2 : 1}
                value={texts[k] || ""}
                onChange={(e) => setTexts({ ...texts, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "visibility") {
    panel = (
      <div className="space-y-3">
        <div className="flex justify-end"><SaveBtn onClick={() => save("/api/admin/visibility", vis)} /></div>
        <div className="bg-white rounded-2xl border divide-y">
          {Object.keys(VIS_LABELS).map((k) => {
            const on = vis[k] !== false;
            return (
              <button
                key={k}
                type="button"
                className="w-full flex items-center justify-between px-4 py-4 text-right"
                onClick={() => setVis({ ...vis, [k]: !on })}
              >
                <span className="font-medium text-sm">{VIS_LABELS[k]}</span>
                <span className={`w-12 h-7 rounded-full relative ${on ? "bg-brand-600" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow ${on ? "right-0.5" : "left-0.5"}`} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (tab === "services") {
    panel = (
      <div className="space-y-3">
        <button type="button" onClick={() => setEditSvc({ id: null, title: "", short: "", description: "", slug: "", icon: "Wrench", image: "", features: [] })} className="bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> إضافة
        </button>
        {editSvc && (
          <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 space-y-2">
            <input className={inputCls} placeholder="العنوان" value={editSvc.title} onChange={(e) => setEditSvc({ ...editSvc, title: e.target.value })} />
            <input className={inputCls} placeholder="وصف قصير" value={editSvc.short} onChange={(e) => setEditSvc({ ...editSvc, short: e.target.value })} />
            <textarea className={inputCls} placeholder="وصف" rows={3} value={editSvc.description} onChange={(e) => setEditSvc({ ...editSvc, description: e.target.value })} />
            <ImgUpload onUrl={(url) => setEditSvc({ ...editSvc, image: url })} />
            {editSvc.image && <img src={editSvc.image} alt="" className="h-16 rounded-lg object-cover" />}
            <div className="flex gap-2">
              <button type="button" className="flex-1 bg-brand-700 text-white font-bold py-3 rounded-xl" onClick={async () => {
                if (await save("/api/admin/services", editSvc, editSvc.id ? "PUT" : "POST")) { setEditSvc(null); loadAll(); }
              }}>حفظ</button>
              <button type="button" className="flex-1 border py-3 rounded-xl" onClick={() => setEditSvc(null)}>إلغاء</button>
            </div>
          </div>
        )}
        {services.map((s) => (
          <div key={s.id} className="bg-white border rounded-2xl p-3 flex justify-between items-center gap-2">
            <span className="font-medium text-sm truncate">{s.title}</span>
            <div className="flex gap-2 shrink-0">
              <button type="button" className="text-brand-700 text-sm" onClick={() => setEditSvc({ ...s, features: typeof s.features === "string" ? JSON.parse(s.features || "[]") : s.features })}>تعديل</button>
              <button type="button" className="text-red-500 text-sm" onClick={async () => { if (confirm("حذف؟")) { await save("/api/admin/services", { id: s.id }, "DELETE"); loadAll(); } }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "areas") {
    panel = (
      <div className="space-y-3">
        <button type="button" onClick={() => setEditArea({ id: null, title: "", description: "", excerpt: "", content: "", responseTime: "30–60 دقيقة", slug: "" })} className="bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> إضافة
        </button>
        {editArea && (
          <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 space-y-2">
            <input className={inputCls} placeholder="اسم المنطقة" value={editArea.title} onChange={(e) => setEditArea({ ...editArea, title: e.target.value })} />
            <input className={inputCls} placeholder="وصف SEO" value={editArea.description} onChange={(e) => setEditArea({ ...editArea, description: e.target.value })} />
            <input className={inputCls} placeholder="وقت الاستجابة" value={editArea.responseTime} onChange={(e) => setEditArea({ ...editArea, responseTime: e.target.value })} />
            <textarea className={inputCls} placeholder="محتوى الصفحة (SEO)" rows={5} value={editArea.content || ""} onChange={(e) => setEditArea({ ...editArea, content: e.target.value })} />
            <div className="flex gap-2">
              <button type="button" className="flex-1 bg-brand-700 text-white font-bold py-3 rounded-xl" onClick={async () => {
                if (await save("/api/admin/areas", editArea, editArea.id ? "PUT" : "POST")) { setEditArea(null); loadAll(); }
              }}>حفظ</button>
              <button type="button" className="flex-1 border py-3 rounded-xl" onClick={() => setEditArea(null)}>إلغاء</button>
            </div>
          </div>
        )}
        {areas.map((a) => (
          <div key={a.id} className="bg-white border rounded-2xl p-3 flex justify-between items-center">
            <span className="font-medium text-sm">{a.title}</span>
            <div className="flex gap-2">
              <button type="button" className="text-brand-700 text-sm" onClick={() => setEditArea(a)}>تعديل</button>
              <button type="button" className="text-red-500 text-sm" onClick={async () => { if (confirm("حذف؟")) { await save("/api/admin/areas", { id: a.id }, "DELETE"); loadAll(); } }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "reviews") {
    panel = (
      <div className="space-y-3">
        <button type="button" onClick={() => setEditReview({ id: null, name: "", area: "", rating: 5, text: "", published: true })} className="bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> إضافة رأي
        </button>
        {editReview && (
          <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 space-y-2">
            <input className={inputCls} placeholder="الاسم" value={editReview.name} onChange={(e) => setEditReview({ ...editReview, name: e.target.value })} />
            <input className={inputCls} placeholder="المنطقة" value={editReview.area} onChange={(e) => setEditReview({ ...editReview, area: e.target.value })} />
            <input className={inputCls} type="number" min={1} max={5} placeholder="التقييم 1-5" value={editReview.rating} onChange={(e) => setEditReview({ ...editReview, rating: Number(e.target.value) })} />
            <textarea className={inputCls} rows={3} placeholder="نص الرأي" value={editReview.text} onChange={(e) => setEditReview({ ...editReview, text: e.target.value })} />
            <div className="flex gap-2">
              <button type="button" className="flex-1 bg-brand-700 text-white font-bold py-3 rounded-xl" onClick={async () => {
                if (await save("/api/admin/reviews", editReview, editReview.id ? "PUT" : "POST")) { setEditReview(null); loadAll(); }
              }}>حفظ</button>
              <button type="button" className="flex-1 border py-3 rounded-xl" onClick={() => setEditReview(null)}>إلغاء</button>
            </div>
          </div>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border rounded-2xl p-3">
            <div className="font-bold text-sm">{r.name} <span className="text-amber-500">{"★".repeat(r.rating)}</span></div>
            <p className="text-sm text-slate-600 mt-1">{r.text}</p>
            <div className="flex gap-2 mt-2">
              <button type="button" className="text-brand-700 text-sm" onClick={() => setEditReview(r)}>تعديل</button>
              <button type="button" className="text-red-500 text-sm" onClick={async () => { if (confirm("حذف؟")) { await save("/api/admin/reviews", { id: r.id }, "DELETE"); loadAll(); } }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "gallery") {
    panel = (
      <div className="space-y-3">
        <button type="button" onClick={() => setEditGallery({ id: null, title: "", image: "", caption: "" })} className="bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> إضافة صورة
        </button>
        {editGallery && (
          <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 space-y-2">
            <input className={inputCls} placeholder="العنوان" value={editGallery.title} onChange={(e) => setEditGallery({ ...editGallery, title: e.target.value })} />
            <input className={inputCls} placeholder="تعليق" value={editGallery.caption} onChange={(e) => setEditGallery({ ...editGallery, caption: e.target.value })} />
            <ImgUpload onUrl={(url) => setEditGallery({ ...editGallery, image: url })} />
            {editGallery.image && <img src={editGallery.image} alt="" className="h-24 rounded-lg object-cover" />}
            <div className="flex gap-2">
              <button type="button" className="flex-1 bg-brand-700 text-white font-bold py-3 rounded-xl" onClick={async () => {
                if (await save("/api/admin/gallery", editGallery, editGallery.id ? "PUT" : "POST")) { setEditGallery(null); loadAll(); }
              }}>حفظ</button>
              <button type="button" className="flex-1 border py-3 rounded-xl" onClick={() => setEditGallery(null)}>إلغاء</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {gallery.map((g) => (
            <div key={g.id} className="bg-white border rounded-2xl overflow-hidden">
              <img src={g.image} alt={g.title} className="h-28 w-full object-cover" />
              <div className="p-2 flex justify-between items-center">
                <span className="text-xs font-medium truncate">{g.title}</span>
                <button type="button" className="text-red-500 text-xs" onClick={async () => { if (confirm("حذف؟")) { await save("/api/admin/gallery", { id: g.id }, "DELETE"); loadAll(); } }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "articles") {
    panel = (
      <div className="space-y-3">
        <button type="button" onClick={() => setEditArticle({ id: null, title: "", slug: "", excerpt: "", content: "", image: "", published: true })} className="bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-1">
          <Plus className="w-4 h-4" /> مقال جديد
        </button>
        {editArticle && (
          <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 space-y-2">
            <input className={inputCls} placeholder="العنوان" value={editArticle.title} onChange={(e) => setEditArticle({ ...editArticle, title: e.target.value })} />
            <input className={inputCls} placeholder="ملخص" value={editArticle.excerpt} onChange={(e) => setEditArticle({ ...editArticle, excerpt: e.target.value })} />
            <textarea className={inputCls} rows={8} placeholder="المحتوى" value={editArticle.content} onChange={(e) => setEditArticle({ ...editArticle, content: e.target.value })} />
            <ImgUpload onUrl={(url) => setEditArticle({ ...editArticle, image: url })} />
            <div className="flex gap-2">
              <button type="button" className="flex-1 bg-brand-700 text-white font-bold py-3 rounded-xl" onClick={async () => {
                if (await save("/api/admin/articles", editArticle, editArticle.id ? "PUT" : "POST")) { setEditArticle(null); loadAll(); }
              }}>حفظ</button>
              <button type="button" className="flex-1 border py-3 rounded-xl" onClick={() => setEditArticle(null)}>إلغاء</button>
            </div>
          </div>
        )}
        {articles.map((a) => (
          <div key={a.id} className="bg-white border rounded-2xl p-3 flex justify-between gap-2">
            <span className="font-medium text-sm truncate">{a.title}</span>
            <div className="flex gap-2 shrink-0">
              <button type="button" className="text-brand-700 text-sm" onClick={() => setEditArticle(a)}>تعديل</button>
              <button type="button" className="text-red-500 text-sm" onClick={async () => { if (confirm("حذف؟")) { await save("/api/admin/articles", { id: a.id }, "DELETE"); loadAll(); } }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "why") {
    panel = (
      <div className="space-y-3">
        <div className="flex justify-end"><SaveBtn onClick={() => save("/api/admin/why", why)} /></div>
        <div className="bg-white rounded-2xl border p-3 space-y-2">
          {why.map((w, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} value={w} onChange={(e) => { const n = [...why]; n[i] = e.target.value; setWhy(n); }} />
              <button type="button" className="text-red-500 p-2" onClick={() => setWhy(why.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" className="text-brand-700 text-sm font-semibold flex items-center gap-1" onClick={() => setWhy([...why, ""])}>
            <Plus className="w-4 h-4" /> إضافة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-100">
      <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b h-14 items-center px-6 justify-between">
        <div className="font-bold text-brand-900">لوحة تحكم {settings.name || ""}</div>
        <div className="flex items-center gap-4">
          {msg && <span className={`text-sm px-3 py-1 rounded-full ${msg.includes("تم") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{msg}</span>}
          <a href="/" target="_blank" className="text-sm text-brand-600">الموقع ↗</a>
          <button type="button" onClick={logout} className="text-sm text-slate-500 flex items-center gap-1"><LogOut className="w-4 h-4" />خروج</button>
        </div>
      </header>

      <header className="lg:hidden sticky top-0 z-30 bg-brand-900 text-white">
        <div className="flex items-center justify-between h-14 px-3">
          <button type="button" onClick={() => setMobileMenu(true)} className="p-2.5" aria-label="قائمة"><Menu className="w-6 h-6" /></button>
          <div className="font-bold text-sm truncate max-w-[50%]">{currentTab.label}</div>
          <button type="button" onClick={logout} className="p-2.5" aria-label="خروج"><LogOut className="w-5 h-5" /></button>
        </div>
        {msg && <div className={`px-3 py-2 text-xs text-center ${msg.includes("تم") ? "bg-emerald-600" : "bg-red-600"}`}>{msg}</div>}
      </header>

      {mobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-brand-900 text-white flex flex-col">
          <div className="flex items-center justify-between h-14 px-3 border-b border-white/10">
            <span className="font-bold">القائمة</span>
            <button type="button" onClick={() => setMobileMenu(false)} className="p-2.5"><X className="w-6 h-6" /></button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} type="button" onClick={() => { setTab(t.id); setMobileMenu(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl ${tab === t.id ? "bg-white text-brand-900 font-bold" : "hover:bg-white/10"}`}>
                  <Icon className="w-5 h-5" />{t.label}
                  {t.id === "leads" && leads.filter((l) => l.status === "new").length > 0 && (
                    <span className="mr-auto bg-amber-400 text-brand-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {leads.filter((l) => l.status === "new").length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <div className="lg:max-w-6xl lg:mx-auto lg:px-6 lg:py-6 lg:flex lg:gap-6">
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="bg-white rounded-2xl border p-2 space-y-0.5 sticky top-20">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${tab === t.id ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-slate-50"}`}>
                  <Icon className="w-4 h-4" />{t.label}
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0 px-3 sm:px-4 py-4 lg:px-0 pb-24 lg:pb-8">
          <h1 className="hidden lg:block text-2xl font-bold mb-5">{currentTab.label}</h1>
          {panel}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 h-16">
          {tabs.filter((t) => ["dash", "leads", "services", "reviews", "articles"].includes(t.id)).map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${tab === t.id ? "text-brand-700" : "text-slate-400"}`}>
                <Icon className="w-5 h-5" />
                {t.short}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
