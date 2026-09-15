export type Lang = "en" | "so" | "ar";

export const languages: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "so", label: "Somali", native: "Soomaali" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

export const rtlLangs: Lang[] = ["ar"];

type Dict = Record<string, string>;

export const dictionaries: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.careers": "Careers",
    "nav.about": "About us",
    "nav.support": "Support",
    "nav.dashboard": "Dashboard",
    "nav.signOut": "Sign out",
    "nav.cta": "Start free analysis",
    "nav.language": "Language",

    "footer.tagline": "AI-driven graduate skill-gap intelligence. MVP build, 2026.",

    "home.badge": "MVP · Phase 1 shipping",
    "home.h1a": "The gap between a degree and",
    "home.h1b": "a job offer",
    "home.h1c": ", measured.",
    "home.lede":
      "SkillGap reads your profile and the skills your target career actually requires, then tells you exactly which skills are missing — and what to learn next.",
    "home.ctaPrimary": "Assess my skill gap",
    "home.ctaSecondary": "Browse careers",
    "home.gapDetected": "Gap detected",
    "home.gapExample": "SQL · Data modelling · Stakeholder comms",

    "metric.precision": "Model precision target",
    "metric.latency": "Median query response",
    "metric.uptime": "Uptime with failover",
    "metric.users": "Users at pilot scale",

    "personas.eyebrow": "Who it serves",
    "personas.title": "Three people, one goal: skills that match the job market.",
    "persona.grad.name": "Ayaan — Graduate",
    "persona.grad.need":
      "Wants a clear skill assessment and a learning path that leads to a real job.",
    "persona.grad.t1": "Skill assessment",
    "persona.grad.t2": "Learning path",
    "persona.grad.t3": "Mobile friendly",
    "persona.adv.name": "Mohamed — Career counsellor",
    "persona.adv.need":
      "Sees which skills students are missing compared with what the job market demands.",
    "persona.adv.t1": "Student reports",
    "persona.adv.t2": "Clear data",
    "persona.adv.t3": "Skill guidance",
    "persona.emp.name": "Hodan — Employer",
    "persona.emp.need":
      "Knows which skills candidates hold, which are missing, and where they fit best.",
    "persona.emp.t1": "Talent matching",
    "persona.emp.t2": "Role requirements",
    "persona.emp.t3": "Market data",

    "cap.eyebrow": "What the system does",
    "cap.title": "Everything the analyzer needs — nothing it doesn't.",
    "cap.1.t": "Your profile & skills",
    "cap.1.b":
      "Register, pick a career and rate the skills you actually have on a simple 0–5 scale.",
    "cap.2.t": "Skill analysis engine",
    "cap.2.b":
      "Your levels are compared with the benchmark for the role and weighted by how important each skill is.",
    "cap.3.t": "Gap report",
    "cap.3.b":
      "A readiness score plus a prioritised list of the skills holding you back the most.",
    "cap.4.t": "Progress tracking",
    "cap.4.b": "Re-run any career later and watch the gap close analysis by analysis.",
    "cap.5.t": "Career library",
    "cap.5.b": "Benchmarked roles across tech, health, business and law to compare against.",
    "cap.6.t": "Private by design",
    "cap.6.b": "Your analyses are visible only to you, enforced at the database level.",

    "cta.titleA": "Know the skills you have and",
    "cta.titleB": "the ones you're missing",
    "cta.body":
      "Choose the career you're aiming for, rate your skill levels, then get a report telling you what to improve and what to do next.",
    "cta.button": "Start free analysis",
  },

  so: {
    "nav.home": "Bogga hore",
    "nav.careers": "Shaqooyinka",
    "nav.about": "Ku saabsan",
    "nav.support": "Taageero",
    "nav.dashboard": "Shaxda",
    "nav.signOut": "Ka bax",
    "nav.cta": "Bilow qiimeyn bilaash",
    "nav.language": "Luqadda",

    "footer.tagline":
      "Xogta xirfadaha qalin-jabiyeyaasha oo AI ku shaqeeya. Nooca MVP, 2026.",

    "home.badge": "MVP · Wejiga 1aad",
    "home.h1a": "Farqiga u dhexeeya shatiga iyo",
    "home.h1b": "shaqo la helo",
    "home.h1c": ", oo la cabbiray.",
    "home.lede":
      "SkillGap wuxuu akhriyaa xogtaada iyo xirfadaha shaqada aad hiigsanayso u baahan tahay, kadibna wuxuu kuu sheegaa xirfadaha kaa maqan iyo waxa aad xigta barato.",
    "home.ctaPrimary": "Qiimee xirfadahayga",
    "home.ctaSecondary": "Fiiri shaqooyinka",
    "home.gapDetected": "Farqi la ogaaday",
    "home.gapExample": "SQL · Qaabaynta xogta · Isgaarsiinta",

    "metric.precision": "Saxnaanta model-ka",
    "metric.latency": "Celceliska jawaabta",
    "metric.uptime": "Shaqaynta joogtada",
    "metric.users": "Isticmaalayaal tijaabo",

    "personas.eyebrow": "Cidda uu u adeegayo",
    "personas.title": "Saddex qof, hal ujeeddo: xirfado la jaanqaada suuqa shaqada.",
    "persona.grad.name": "Ayaan — Qalin-jabiye",
    "persona.grad.need":
      "Waxay rabtaa qiimeyn xirfadeed oo cad iyo waddo waxbarasho oo shaqo u horseedda.",
    "persona.grad.t1": "Qiimeyn xirfadeed",
    "persona.grad.t2": "Jid waxbarasho",
    "persona.grad.t3": "Mobil ku habboon",
    "persona.adv.name": "Maxamed — La-taliye xirfadeed",
    "persona.adv.need":
      "Wuxuu arkaa xirfadaha ay ardaydu ka dhiman yihiin marka loo eego baahida suuqa shaqada.",
    "persona.adv.t1": "Warbixin arday",
    "persona.adv.t2": "Xog muuqata",
    "persona.adv.t3": "Jihayn xirfadeed",
    "persona.emp.name": "Hodan — Shaqo-bixiye",
    "persona.emp.need":
      "Waxay ogaataa xirfadaha musharraxiintu hayaan, kuwa ka maqan, iyo shaqada ay ku habboon yihiin.",
    "persona.emp.t1": "Helidda hibada",
    "persona.emp.t2": "Baahida shaqada",
    "persona.emp.t3": "Xogta suuqa",

    "cap.eyebrow": "Waxa systemku qabto",
    "cap.title": "Wax kasta oo qiimeynta xirfadaha u baahan tahay — wax dheeraad ah ma jiro.",
    "cap.1.t": "Xogtaada & xirfadahaada",
    "cap.1.b":
      "Isdiiwaangeli, dooro shaqo, kadibna qiimee xirfadaha aad haysato heerka 0–5.",
    "cap.2.t": "Mishiinka falanqaynta",
    "cap.2.b":
      "Heerarkaaga waxaa la barbar dhigaa heerka shaqada loo baahan yahay iyo muhiimadda xirfad kasta.",
    "cap.3.t": "Warbixinta farqiga",
    "cap.3.b":
      "Dhibcaha diyaargarowga iyo liis hormar leh oo muujinaya xirfadaha ugu muhiimsan ee kaa maqan.",
    "cap.4.t": "Raadraaca horumarka",
    "cap.4.b": "Ku celi qiimeynta mar dambe oo arag sida farqigu u yaraanayo.",
    "cap.5.t": "Maktabadda shaqooyinka",
    "cap.5.b": "Shaqooyin la cabbiray oo ka kala socda tignoolajiyada, caafimaadka, ganacsiga iyo sharciga.",
    "cap.6.t": "Sir ilaalin",
    "cap.6.b": "Qiimeyntaada adiga uun ayaa arkaya, waana lagu ilaaliyaa heerka xogta.",

    "cta.titleA": "Ogoow xirfadaha aad leedahay iyo",
    "cta.titleB": "kuwa kaa maqan",
    "cta.body":
      "Dooro shaqada aad hiigsanayso, qiimee heerka xirfadahaaga, kadibna hel warbixin kuu sheegaysa waxa aad horumarinayso iyo tallaabada xigta.",
    "cta.button": "Bilow qiimeyn bilaash",
  },

  ar: {
    "nav.home": "الرئيسية",
    "nav.careers": "المهن",
    "nav.about": "من نحن",
    "nav.support": "الدعم",
    "nav.dashboard": "لوحة التحكم",
    "nav.signOut": "تسجيل الخروج",
    "nav.cta": "ابدأ التحليل مجانًا",
    "nav.language": "اللغة",

    "footer.tagline": "تحليل فجوة مهارات الخريجين بالذكاء الاصطناعي. إصدار MVP، 2026.",

    "home.badge": "MVP · المرحلة الأولى",
    "home.h1a": "الفجوة بين الشهادة و",
    "home.h1b": "عرض العمل",
    "home.h1c": "، مقيسة.",
    "home.lede":
      "يقرأ SkillGap ملفك والمهارات التي تتطلبها المهنة المستهدفة، ثم يخبرك بالمهارات الناقصة وما يجب تعلمه بعد ذلك.",
    "home.ctaPrimary": "قيّم فجوة مهاراتي",
    "home.ctaSecondary": "استعرض المهن",
    "home.gapDetected": "تم رصد فجوة",
    "home.gapExample": "SQL · نمذجة البيانات · التواصل",

    "metric.precision": "هدف دقة النموذج",
    "metric.latency": "متوسط زمن الاستجابة",
    "metric.uptime": "الجهوزية مع التحويل التلقائي",
    "metric.users": "مستخدمون في المرحلة التجريبية",

    "personas.eyebrow": "لمن هذا النظام",
    "personas.title": "ثلاثة أشخاص، هدف واحد: مهارات تناسب سوق العمل.",
    "persona.grad.name": "أيان — خريجة",
    "persona.grad.need": "تريد تقييمًا واضحًا لمهاراتها ومسارًا تعليميًا يوصلها إلى وظيفة حقيقية.",
    "persona.grad.t1": "تقييم المهارات",
    "persona.grad.t2": "مسار تعليمي",
    "persona.grad.t3": "مناسب للهاتف",
    "persona.adv.name": "محمد — مرشد مهني",
    "persona.adv.need": "يرى المهارات الناقصة لدى الطلاب مقارنة بما يطلبه سوق العمل.",
    "persona.adv.t1": "تقارير الطلاب",
    "persona.adv.t2": "بيانات واضحة",
    "persona.adv.t3": "توجيه مهاري",
    "persona.emp.name": "هدن — صاحبة عمل",
    "persona.emp.need": "تعرف مهارات المتقدمين، وما ينقصهم، والوظيفة الأنسب لهم.",
    "persona.emp.t1": "مطابقة الكفاءات",
    "persona.emp.t2": "متطلبات الوظيفة",
    "persona.emp.t3": "بيانات السوق",

    "cap.eyebrow": "ماذا يفعل النظام",
    "cap.title": "كل ما يحتاجه محلل الفجوة — دون زيادة.",
    "cap.1.t": "ملفك ومهاراتك",
    "cap.1.b": "سجّل، اختر مهنة، وقيّم مهاراتك الفعلية على مقياس من 0 إلى 5.",
    "cap.2.t": "محرك التحليل",
    "cap.2.b": "تُقارن مستوياتك بالمستوى المرجعي للمهنة مع مراعاة أهمية كل مهارة.",
    "cap.3.t": "تقرير الفجوة",
    "cap.3.b": "درجة جهوزية وقائمة مرتبة بالمهارات التي تعيقك أكثر.",
    "cap.4.t": "متابعة التقدم",
    "cap.4.b": "أعد التحليل لاحقًا وشاهد الفجوة تتقلص.",
    "cap.5.t": "مكتبة المهن",
    "cap.5.b": "مهن مرجعية في التقنية والصحة والأعمال والقانون.",
    "cap.6.t": "خصوصية بالتصميم",
    "cap.6.b": "تحليلاتك مرئية لك وحدك، محمية على مستوى قاعدة البيانات.",

    "cta.titleA": "اعرف المهارات التي تمتلكها و",
    "cta.titleB": "التي تنقصك",
    "cta.body":
      "اختر المهنة التي تستهدفها، قيّم مستويات مهاراتك، ثم احصل على تقرير يوضح ما يجب تحسينه وخطوتك التالية.",
    "cta.button": "ابدأ التحليل مجانًا",
  },
};
