import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "دار السباكة",
      tagline: "سباك الكويت المعتمد",
      phone: "94021192",
      whatsapp: "96594021192",
      email: "info@plumberkuw.com",
      address: "الكويت - جميع المحافظات",
      hours: "24 ساعة / 7 أيام",
      description: "أفضل سباك صحي في الكويت - صيانة، تسليك مجاري، كشف تسربات بدون تكسير، وتركيب. خدمة 24 ساعة.",
    },
  });

  const texts: Record<string, string> = {
    "home.heroBadge": "متاحون 24 ساعة طوال أيام الأسبوع",
    "home.heroTitle": "سباك الكويت المعتمد",
    "home.heroSubtitle": "خدمة سباكة احترافية بضمان مكتوب",
    "home.heroDesc": "صيانة • تسليك مجاري • كشف تسربات بدون تكسير • تركيب سخانات ومضخات\nفنيين معتمدين • أسعار واضحة من أول مكالمة",
    "home.btnCall": "اتصل الآن",
    "home.btnWhatsapp": "واتساب فوري",
    "home.servicesTitle": "خدمات السباكة المتكاملة",
    "home.servicesSubtitle": "نغطي كل احتياجاتك من الطوارئ لحد التأسيس الكامل",
    "home.servicesMore": "التفاصيل",
    "home.whyTitle": "لماذا تختار دار السباكة؟",
    "home.whyDesc": "خبرة، أمانة، وضمان حقيقي على كل عمل.",
    "home.whyBtn": "اطلب خدمة",
    "home.areasEyebrow": "تغطية شاملة",
    "home.areasTitle": "نخدم جميع مناطق الكويت",
    "home.areasSubtitle": "فريق جاهز للوصول إليك في أي محافظة",
    "home.ctaTitle": "مشكلة سباكة؟ نحن هنا على مدار الساعة",
    "home.ctaDesc": "لا تنتظر حتى تتفاقم المشكلة — اتصل الآن",
    "home.ctaWhatsapp": "واتساب",
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "nav.call": "اتصل",
    "nav.tagline": "سباك الكويت 24 ساعة",
    "footer.servicesTitle": "خدماتنا",
    "footer.contactTitle": "تواصل",
    "footer.rights": "جميع الحقوق محفوظة",
    "page.servicesTitle": "خدمات السباكة",
    "page.aboutTitle": "من نحن",
    "page.aboutBody": "نعمل على مدار الساعة في جميع مناطق الكويت بفنيين معتمدين وضمان على الأعمال.",
    "page.contactTitle": "اتصل بنا",
    "page.contactCta": "طلب خدمة فورية",
    "page.backToServices": "الخدمات",
    "label.phone": "الهاتف",
    "label.email": "البريد",
    "label.address": "العنوان",
    "label.hours": "الوقت",
    "home.formTitle": "اطلب خدمة الآن",
    "home.reviewsTitle": "آراء عملائنا",
    "home.galleryTitle": "من أعمالنا",
    "home.blogTitle": "من المدونة",
    "page.blogTitle": "مدونة السباكة",
    "nav.blog": "المدونة",
  };
  for (const [id, value] of Object.entries(texts)) {
    await prisma.textContent.upsert({ where: { id }, update: { value }, create: { id, value } });
  }

  const vis = ["showHero", "showServices", "showWhy", "showAreas", "showCta", "showFloating", "showLeadForm", "showReviews", "showGallery", "showBlog"];
  for (const id of vis) {
    await prisma.visibility.upsert({ where: { id }, update: {}, create: { id, visible: true } });
  }

  const services = [
    { slug: "drain-cleaning", title: "تسليك مجاري وبواليع", short: "تسليك بأحدث المعدات بدون تكسير غير ضروري", description: "كاميرا داخلية + ماكينة ضغط عالي + شفط. نحدد مكان الانسداد بدقة ونحله من الجذور.", icon: "Wrench", features: ["كاميرا تصوير داخل المواسير", "ماكينة ضغط عالي", "استجابة 24 ساعة"], order: 1 },
    { slug: "leak-detection", title: "كشف تسربات بدون تكسير", short: "أجهزة حرارية وصوتية لتحديد موقع التسرب", description: "كشف تسربات المياه المخفية بدون تكسير واسع، مع تقرير فني وإصلاح دقيق.", icon: "Search", features: ["أجهزة كشف حديثة", "أقل تكسير ممكن", "تقرير فني"], order: 2 },
    { slug: "bathroom", title: "تجديد وتأسيس الحمامات", short: "تأسيس سباكة جديدة وتركيب أدوات صحية", description: "تأسيس شبكات من الصفر وتجديد الحمامات مع حنفيات ذكية وضمان على التركيب.", icon: "Bath", features: ["تأسيس مواسير", "أدوات صحية", "ضمان تركيب"], order: 3 },
    { slug: "heaters", title: "سخانات المياه", short: "تركيب وصيانة سخانات فورية ومركزية", description: "تركيب سخانات مع صمامات أمان وضبط ضغط ودرجة حرارة، وضمان على الشغل.", icon: "Flame", features: ["فوري ومركزي", "صمامات أمان", "ضمان"], order: 4 },
    { slug: "pumps", title: "مضخات المياه", short: "حل ضعف الضغط في الأدوار العليا", description: "اختيار وتركيب المضخة المناسبة لضمان تدفق قوي في كل أنحاء المنزل.", icon: "Droplets", features: ["أوتوماتيك ويدوي", "معاينة أولاً", "تركيب احترافي"], order: 5 },
    { slug: "pipes", title: "تمديد مواسير", short: "مواسير PPR ونحاس عالية الجودة", description: "تمديد وتبديل المواسير حسب الاستخدام مع مقاومة للصدأ وعمر طويل.", icon: "Pipette", features: ["PPR ونحاس", "مقاومة صدأ", "جودة عالية"], order: 6 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, features: JSON.stringify(s.features) },
    });
  }

  const areas = [
    { slug: "kuwait-city", title: "العاصمة", description: "سباك العاصمة — استجابة سريعة", responseTime: "30–60 د", order: 1 },
    { slug: "hawally", title: "حولي", description: "سباك حولي والمناطق المحيطة", responseTime: "20–40 د", order: 2 },
    { slug: "salmiya", title: "السالمية", description: "سباك السالمية والشقق متعددة الطوابق", responseTime: "20–35 د", order: 3 },
    { slug: "farwaniya", title: "الفروانية", description: "سباك الفروانية والضواحي", responseTime: "40–70 د", order: 4 },
    { slug: "ahmadi", title: "الأحمدي", description: "سباك الأحمدي والفحيحيل", responseTime: "45–90 د", order: 5 },
    { slug: "jahra", title: "الجهراء", description: "سباك الجهراء", responseTime: "50–90 د", order: 6 },
  ];
  for (const a of areas) {
    await prisma.area.upsert({ where: { slug: a.slug }, update: {}, create: a });
  }

  const why = [
    "فنيين معتمدين وخبرة عملية",
    "سعر تقريبي واضح من أول مكالمة",
    "أجهزة كشف تسربات بدون تكسير",
    "ضمان مكتوب على التركيب",
    "تغطية كل محافظات الكويت",
    "طوارئ 24 ساعة",
  ];
  await prisma.whyPoint.deleteMany();
  for (let i = 0; i < why.length; i++) {
    await prisma.whyPoint.create({ data: { text: why[i], order: i } });
  }

  
  // enrich area content for SEO
  const areaContents: Record<string, string> = {
    "kuwait-city": "نغطي مدينة الكويت والمناطق التجارية: شرق، القبلة، المرقاب. تسليك، كشف تسربات، وتركيب بضمان. للطوارئ اتصل فورًا.",
    "hawally": "سباك حولي للمناطق السكنية والتجارية. خبرة في الشبكات القديمة والمجمعات. استجابة سريعة داخل حولي.",
    "salmiya": "السالمية كثافة شقق عالية — ضعف ضغط الأدوار العليا وتسربات الصرف المشتركة من أكثر الحالات. مضخات وصيانة دورية.",
    "farwaniya": "خدمة سباكة في الفروانية وخيطان والعمرية. تسليك ومجاري وتمديدات بأسعار واضحة من أول مكالمة.",
    "ahmadi": "الأحمدي والفحيحيل والمنقف — صيانة وتركيب وتسليك على مدار الساعة مع ضمان على الشغل.",
    "jahra": "سباك الجهراء والمناطق الغربية. وصول منظم للطوارئ والصيانة الدورية.",
  };
  for (const [slug, content] of Object.entries(areaContents)) {
    await prisma.area.updateMany({ where: { slug }, data: { content } });
  }

  const reviews = [
    { name: "أحمد العتيبي", area: "السالمية", rating: 5, text: "وصلوا بسرعة وحلوا انسداد المجاري بدون تكسير. شغل نظيف وسعر واضح.", order: 1 },
    { name: "فاطمة", area: "حولي", rating: 5, text: "كشفوا تسريب تحت البلاط بدقة. أنصح فيهم.", order: 2 },
    { name: "خالد", area: "الفروانية", rating: 5, text: "ركبوا سخان ومضخة في نفس اليوم. التزام بالموعد.", order: 3 },
  ];
  if ((await prisma.review.count()) === 0) {
    for (const r of reviews) await prisma.review.create({ data: r });
  }

  const gallery = [
    { title: "تسليك مجاري", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800", caption: "بدون تكسير واسع", order: 1 },
    { title: "تركيب سخان", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800", caption: "مع صمامات أمان", order: 2 },
    { title: "تجديد حمام", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800", caption: "تأسيس و تشطيب", order: 3 },
  ];
  if ((await prisma.galleryItem.count()) === 0) {
    for (const g of gallery) await prisma.galleryItem.create({ data: g });
  }

  if ((await prisma.article.count()) === 0) {
    await prisma.article.create({
      data: {
        slug: "5-signs-need-plumber",
        title: "5 علامات إنك محتاج سباك فورًا",
        excerpt: "من صوت الغرغرة لضعف الضغط — متى تتصل قبل ما المشكلة تكبر؟",
        content: "1) ماء بينزل ببطء في الحوض أو الدش.\n2) رائحة كريهة متكررة من الصرف.\n3) ارتفاع فاتورة المياه بدون سبب.\n4) بقع رطوبة على السقف أو الحائط.\n5) صوت جريان مستمر والمياه مقفولة.\n\nلو لاحظت علامة أو أكتر، اتصل بفني معتمد قبل ما الضرر يتوسع.",
        published: true,
      },
    });
    await prisma.article.create({
      data: {
        slug: "leak-without-breaking",
        title: "كشف تسربات بدون تكسير — إزاي؟",
        excerpt: "أجهزة حرارية وصوتية تحدد مكان التسرب بدقة وتقلل التكسير.",
        content: "التقنيات الحديثة تعتمد على استشعار الحرارة والرطوبة والصوت داخل المواسير.\nبعد تحديد النقطة، الإصلاح يكون موضعي قدر الإمكان.\nاطلب معاينة وشرح للتكلفة قبل بدء الشغل.",
        published: true,
      },
    });
  }


  console.log("Seed completed ✓");
}

main().finally(() => prisma.$disconnect());
