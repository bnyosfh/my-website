// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const langToggle = document.getElementById('langToggle');
const projectsWrap = document.getElementById('projects');

const LS = {
  get(k){ try { return localStorage.getItem(k) } catch { return null } },
  set(k,v){ try { localStorage.setItem(k,v) } catch {} }
};

// Init theme
const savedTheme = LS.get('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
document.body.classList.toggle('dark', savedTheme === 'dark');
updateThemeBtn();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  LS.set('theme', document.body.classList.contains('dark') ? 'dark':'light');
  updateThemeBtn();
});
function updateThemeBtn(){
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀' : '☾';
}

// Back-to-top
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// i18n
const i18n = {
  ar: {
    "meta.title": "بورتفوليو حسين بن يوسف - مصمم جرافيك",
    "meta.description": "مصمم جرافيك يحول الأفكار إلى فن بصري: هويات بصرية، إعلانات، مطبوعات.",
    "nav.about":"عني","nav.work":"أعمالي","nav.services":"خدماتي","nav.contact":"اتصل بي",
    "hero.title":"مصمم جرافيك يحول الأفكار إلى فن بصري",
    "hero.subtitle":"أنا حسين بن يوسف، مصمم جرافيك متخصص في تصميم الإعلانات والحملات التسويقية، والهويات البصرية، والمطبوعات.",
    "work.title":"أعمالي","work.more":"عرض مزيد من الأعمال",
    "filters.all":"الكل","filters.branding":"هويات","filters.ads":"إعلانات","filters.print":"مطبوعات","filters.uiux":"واجهات",
    "services.title":"خدماتي",
    "services.branding.title":"الهويات البصرية والشعارات","services.branding.desc":"أنظمة بصرية متكاملة، دليل استخدام الهوية، وتطبيقات على المنصات.",
    "services.ads.title":"الإعلانات والحملات","services.ads.desc":"حملات للسوشيال والمطبوع، تصميمات مؤثرة موجهة للنتائج.",
    "services.print.title":"المطبوعات والتقارير","services.print.desc":"تقارير سنوية، كتيبات، بروشورات، ملفات شركات بجودة طباعة.",
    "contact.title":"اتصل بي",
    "form.name":"الاسم","form.email":"البريد الإلكتروني","form.message":"الرسالة","form.send":"إرسال",
    "footer.name":"حسين بن يوسف"
  },
  en: {
    "meta.title":"Hussain Bin Yousif — Graphic Designer",
    "meta.description":"Graphic designer turning ideas into visual art: Branding, Ads, Print.",
    "nav.about":"About","nav.work":"Work","nav.services":"Services","nav.contact":"Contact",
    "hero.title":"Graphic designer turning ideas into visual art",
    "hero.subtitle":"I'm Hussain Bin Yousif, specializing in advertising campaigns, visual identities, and print design.",
    "work.title":"Selected Work","work.more":"See more",
    "filters.all":"All","filters.branding":"Branding","filters.ads":"Advertising","filters.print":"Print","filters.uiux":"UI/UX",
    "services.title":"Services",
    "services.branding.title":"Branding & Logos","services.branding.desc":"Complete systems, brand guidelines, and applications across platforms.",
    "services.ads.title":"Advertising & Campaigns","services.ads.desc":"Social and print campaigns focused on outcomes.",
    "services.print.title":"Print & Reports","services.print.desc":"Annual reports, brochures, and company profiles ready for press.",
    "contact.title":"Contact",
    "form.name":"Name","form.email":"Email","form.message":"Message","form.send":"Send",
    "footer.name":"Hussain Bin Yousif"
  }
};

function applyI18n(lang){
  document.documentElement.lang = lang === 'ar' ? 'ar':'en';
  document.documentElement.dir  = lang === 'ar' ? 'rtl':'ltr';
  document.title = i18n[lang]['meta.title'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  langToggle.textContent = lang.toUpperCase();
}
const savedLang = LS.get('lang') || 'ar';
applyI18n(savedLang);
langToggle.addEventListener('click', () => {
  const next = (LS.get('lang') || 'ar') === 'ar' ? 'en':'ar';
  LS.set('lang', next); applyI18n(next);
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Projects render + filters
const chips = document.querySelectorAll('.chip');
let currentFilter = 'all';
chips.forEach(ch => ch.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('is-active'));
  ch.classList.add('is-active');
  currentFilter = ch.dataset.filter;
  renderProjects();
}));

let PROJECTS = [];
fetch('data/projects.json')
  .then(r => r.json())
  .then(json => { PROJECTS = json; renderProjects(); })
  .catch(()=>{});

function renderProjects(){
  projectsWrap.innerHTML = '';
  const list = PROJECTS.filter(p => currentFilter === 'all' ? true : p.category === currentFilter);
  for(const p of list){
    const card = document.createElement('article');
    card.className = 'project';
    card.innerHTML = \`
      <img src="\${p.image}" alt="\${p.title}" loading="lazy">
      <h3>\${p.title}</h3>
      <span class="badge">\${p.badge}</span>
    \`;
    if(p.link){ card.style.cursor='pointer'; card.addEventListener('click', ()=> window.open(p.link,'_blank')); }
    projectsWrap.appendChild(card);
  }
}
