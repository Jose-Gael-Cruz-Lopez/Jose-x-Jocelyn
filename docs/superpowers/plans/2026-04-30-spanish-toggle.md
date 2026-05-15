# Spanish Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an EN/ES toggle button to the navbar that switches every visible string on the site to Spanish, with the choice persisted to localStorage.

**Architecture:** A `LanguageContext` holds `lang` ('en'|'es') initialized from localStorage. A `useT(namespace)` hook returns the correct translation object. All strings live in `src/translations/en.js` and `src/translations/es.js`. Every page imports `useT` and renders from `t.key` instead of hardcoded text.

**Tech Stack:** React context, localStorage, Vite/React (no new dependencies)

---

## File map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/context/LanguageContext.jsx` | lang state + setLang + localStorage sync |
| Create | `src/hooks/useT.js` | returns translations[lang][namespace] |
| Create | `src/translations/en.js` | all English strings |
| Create | `src/translations/es.js` | all Spanish strings |
| Modify | `src/main.jsx` | wrap app in LanguageProvider |
| Modify | `src/pages/Home.jsx` | toggle button + useT throughout |
| Modify | `src/pages/BridgeYear.jsx` | useT throughout |
| Modify | `src/pages/InterviewPrep.jsx` | useT throughout |
| Modify | `src/pages/CoffeeChat.jsx` | useT throughout |
| Modify | `src/pages/OpportunityBoard.jsx` | useT throughout |
| Modify | `src/pages/ResumeReviews.jsx` | useT throughout |
| Modify | `src/pages/PartnerPanels.jsx` | useT throughout |
| Modify | `src/pages/LinkedInSeries.jsx` | useT throughout |
| Modify | `src/pages/CareerTemplates.jsx` | useT throughout |
| Modify | `src/pages/articles/ArticlesIndex.jsx` | useT throughout |
| Modify | `src/pages/articles/Rejection.jsx` | useT throughout |
| Modify | `src/pages/articles/FirstGenPlaybook.jsx` | useT throughout |
| Modify | `src/pages/articles/First90Days.jsx` | useT throughout |
| Modify | `src/pages/articles/NegotiateSalary.jsx` | useT throughout |
| Modify | `src/pages/articles/LateCycleInternships.jsx` | useT throughout |
| Modify | `src/pages/articles/CoffeeChatFramework.jsx` | useT throughout |
| Modify | `src/components/ArticleLayout.jsx` | useT throughout |
| Modify | `src/components/ArticleSubscribe.jsx` | useT throughout |
| Modify | `style.css` | styles for .nav__lang-btn |

---

## Conventions used throughout

**Reading a translation key:**
```jsx
const t = useT('home')   // namespace matches the page
// then render:
<h2>{t.aboutTitle}</h2>
```

**Strings with HTML (italics, bold):** use `dangerouslySetInnerHTML`:
```jsx
<p dangerouslySetInnerHTML={{ __html: t.missionBody }} />
```
Translation values that contain HTML use regular HTML tags (`<em>`, `<strong>`). This is safe — values are developer-controlled, never user input.

**Strings with non-breaking hyphens:** write `&#8209;` directly inside the string value in the JS file, or use the unicode char `‑`.

---

## Task 1: LanguageContext + useT hook

**Files:**
- Create: `src/context/LanguageContext.jsx`
- Create: `src/hooks/useT.js`

- [ ] **Step 1: Create LanguageContext**

```jsx
// src/context/LanguageContext.jsx
import { createContext, useContext, useState } from 'react'

export const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('jj-lang') ?? 'en')

  function toggle(newLang) {
    setLang(newLang)
    localStorage.setItem('jj-lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
```

- [ ] **Step 2: Create useT hook**

```js
// src/hooks/useT.js
import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import { en } from '../translations/en'
import { es } from '../translations/es'

const translations = { en, es }

export function useT(namespace) {
  const { lang } = useContext(LanguageContext)
  return translations[lang]?.[namespace] ?? translations['en'][namespace]
}
```

- [ ] **Step 3: Create empty translation scaffolds (will be filled in later tasks)**

```js
// src/translations/en.js
export const en = {}
```

```js
// src/translations/es.js
export const es = {}
```

- [ ] **Step 4: Commit**

```bash
git add src/context/LanguageContext.jsx src/hooks/useT.js src/translations/en.js src/translations/es.js
git commit -m "feat: add LanguageContext, useT hook, and empty translation scaffolds"
```

---

## Task 2: Wrap app + add toggle button CSS

**Files:**
- Modify: `src/main.jsx`
- Modify: `style.css`

- [ ] **Step 1: Read current main.jsx**

Read `src/main.jsx` to see current structure.

- [ ] **Step 2: Wrap app in LanguageProvider**

In `src/main.jsx`, import `LanguageProvider` and wrap the `<App />` (or `<BrowserRouter>`) element:

```jsx
import { LanguageProvider } from './context/LanguageContext'
// wrap the outermost element:
<LanguageProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</LanguageProvider>
```

- [ ] **Step 3: Add toggle button styles to style.css**

Find the `.nav__search-btn` rule block in `style.css`. After it, add:

```css
.nav__lang-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: inherit;
  padding: 4px 2px;
  margin-right: 4px;
}

.nav__lang-active {
  opacity: 1;
}

.nav__lang-inactive {
  opacity: 0.4;
}

.nav__lang-sep {
  opacity: 0.35;
  font-weight: 400;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/main.jsx style.css
git commit -m "feat: wrap app in LanguageProvider, add lang toggle CSS"
```

---

## Task 3: Nav toggle button + Home.jsx translations

This is the largest task. It adds the toggle button to the nav and translates all of Home.jsx.

**Files:**
- Modify: `src/translations/en.js` (add `nav` and `home` namespaces)
- Modify: `src/translations/es.js` (add `nav` and `home` namespaces)
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Read Home.jsx in full**

Read `src/pages/Home.jsx` completely to capture every user-visible string.

- [ ] **Step 2: Add `nav` namespace to en.js**

```js
// add to en.js export const en = { ... }
nav: {
  about: 'About',
  services: 'Services',
  laVoz: 'La Voz del Día',
  getInTouch: 'Get in Touch',
  searchPlaceholder: 'Search pages & sections…',
  searchNoResults: 'No results for',
  searchBtnLabel: 'Search',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  mobileSearch: 'Search',
  // dropdown group labels
  contentLabel: 'Content',
  sprintsLabel: 'Sprints',
  communityLabel: 'Community',
  // dropdown items
  linkedInSeries: 'LinkedIn Series',
  careerTemplates: 'Career Templates',
  bridgeYearSprint: 'Bridge Year Sprint',
  interviewPrep: 'Interview Prep',
  opportunityBoard: 'Opportunity Board',
  coffeeChatNetwork: 'Coffee Chat Network',
  resumeReviews: 'Resume Reviews',
  partnerPanels: 'Partner Panels',
  langToggleLabel: 'Switch language',
},
```

- [ ] **Step 3: Add `nav` namespace to es.js**

```js
nav: {
  about: 'Sobre Nosotros',
  services: 'Servicios',
  laVoz: 'La Voz del Día',
  getInTouch: 'Contáctanos',
  searchPlaceholder: 'Buscar páginas y secciones…',
  searchNoResults: 'Sin resultados para',
  searchBtnLabel: 'Buscar',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  mobileSearch: 'Buscar',
  contentLabel: 'Contenido',
  sprintsLabel: 'Sprints',
  communityLabel: 'Comunidad',
  linkedInSeries: 'Serie de LinkedIn',
  careerTemplates: 'Plantillas de Carrera',
  bridgeYearSprint: 'Sprint del Año Puente',
  interviewPrep: 'Preparación para Entrevistas',
  opportunityBoard: 'Tablero de Oportunidades',
  coffeeChatNetwork: 'Red de Conversaciones',
  resumeReviews: 'Revisión de Currículum',
  partnerPanels: 'Paneles con Socios',
  langToggleLabel: 'Cambiar idioma',
},
```

- [ ] **Step 4: Add `home` namespace to en.js**

```js
home: {
  // Hero
  heroFoot1: 'First-gen',
  heroFoot2: 'Mexican-American',
  heroFoot3: 'Tech careers',

  // Intro
  introText: 'We are two first-generation Mexican-Americans in tech who navigated every career milestone without a blueprint. No legacy connections. No family in the industry. No one to call when the offer letter made no sense. This platform exists to build what we never had: a visible pipeline from campus to career, told by two people at different stages of the same journey.',

  // About section
  aboutNumber: '02',
  aboutTitle: 'Who We Are',
  aboutTabWhoWeAre: 'Who We Are',
  aboutTabMission: 'Mission',
  aboutTabVision: 'Vision',
  aboutSubtitle: 'One pipeline, two perspectives',
  aboutIntro: '<em>From Campus to Career</em> is a collaborative initiative led by Jose G. Cruz‑Lopez and Jocelyn Vazquez. Together, they turn lived experience into a roadmap that helps first‑gen and underrepresented students move confidently from campus to career.',
  joseLabel: 'The Student Perspective',
  joseName: 'Jose G. Cruz‑Lopez',
  joseRole: 'Breaking in',
  joseDesc: 'A first‑generation college student helping peers land internships and early opportunities. Actively recruiting and documenting every step of the student journey in real time.',
  joseTags: ['Internships', 'Applications', 'Fellowships', 'Student Life'],
  jocelynLabel: 'The Post‑Grad Perspective',
  jocelynName: 'Jocelyn Vazquez',
  jocelynRole: 'Leveling up',
  jocelynDesc: 'A first‑generation Information Systems graduate now working in tech and data. Translating the "mystery" parts (compensation, corporate culture, career growth) into first‑gen‑friendly guidance.',
  jocelynTags: ['Full‑Time Roles', 'Negotiation', 'Career Growth', 'Onboarding'],
  aboutClosing: 'More than an idea, <em>From Campus to Career</em> is a movement driven by clarity, opportunity, and community.',
  missionLabel: 'Why we built this and who it is for',
  missionQuote: 'No one should have to <em>guess</em> their way from first internship to first offer. Every step should be <em>visible, mapped,</em> and <em>community‑supported.</em>',
  missionAttribution: 'Jose & Jocelyn',
  missionBody: 'Our mission is to empower first‑generation and underrepresented students to confidently navigate every step from their first internship search to their first full‑time role in tech and data. We make the journey transparent, actionable, and community‑powered because no one should have to guess their way to opportunity.',
  visionBody: 'We envision a future where every first‑generation student graduates with not only skills but direction, supported by a network that transforms uncertainty into possibility and ambition into long‑term success.',

  // C2C section
  c2cLead: 'A structured pipeline that turns first‑gen ambition into real career outcomes.',
  c2cCards: [
    { n: '01', t: 'Content', d: 'Split-screen LinkedIn series and plug-and-play career templates. Real talk from both sides of the pipeline, without the fluff.' },
    { n: '02', t: 'Sprints', d: 'Small-cohort programs built around a single career milestone. Bridge Year Sprint and Interview Prep keep you accountable and moving forward.' },
    { n: '03', t: 'Community', d: 'Curated opportunity board, partner panels, coffee chat networks, and resume review circles. Real connections, not just a group chat.' },
    { n: '04', t: 'La Voz del Día', d: 'Articles on recruiting, internships, full-time offers, and first-gen survival. Written by both of us from both sides of the bridge.' },
  ],
  c2cClosing: '“El camino no se encuentra, se construye. Paso a paso, juntos.”',

  // Services section
  pinataAriaLabel: 'Hit the piñata',
  pinataPrompt: 'Click to hit!',
  servicesTabContent: 'Content',
  servicesTabSprints: 'Sprints',
  servicesTabCommunity: 'Community',
  servicesContentBody: 'Our content strategy prioritizes clarity, shareability, and real value. That means split-screen perspectives, actionable templates, and honest recruiting insights, without the fluff.',
  servicesSprintsBody: 'Sprint-based programs that move small cohorts through a specific career milestone. Weekly application blocks, accountability sessions, interview prep, and storytelling workshops.',
  servicesCommunityBody: 'Community-driven support built on accountability and real connections. Opportunity boards, partnership panels, coffee chat networks, and resume review circles.',

  // Interruption section
  interrLines: ['Transparent.', 'Actionable.', 'Community', 'Powered.'],

  // Editorial section
  editorialLabel: 'Knowledge Hub',
  editorialTitle: 'La Voz del Día',
  editorialDesc: 'Articles on recruiting, internships, full-time offers, and early-career survival, written by both of us from both sides of the bridge.',
  editorialViewAll: 'View All Articles',
  // article cards
  card1Tag: 'Jose',
  card1Title: 'Late-Cycle Internships: Where to Look When Everyone Says It\'s Over',
  card1Excerpt: 'It is April and you still don\'t have an internship. Here is what to do right now.',
  card2Tag: 'Jocelyn',
  card2Title: 'Your First 90 Days: A Survival Guide for First-Gen Professionals',
  card2Excerpt: 'No one teaches you how to read benefits, navigate office politics, or build a career ladder. Until now.',
  card3Tag: 'Both',
  card3Title: 'The Complete First-Gen Internship Playbook',
  card3Excerpt: 'From discovery to signed offer, with no sugar-coating. Everything we learned.',
  card4Tag: 'Jose',
  card4Title: 'The Coffee Chat Framework That Actually Gets Responses',
  card4Excerpt: 'A step-by-step system for reaching out to professionals and turning conversations into opportunities.',
  card5Tag: 'Jocelyn',
  card5Title: 'How to Negotiate When You\'ve Never Seen a Six-Figure Salary',
  card5Excerpt: 'Compensation is benefits, equity, signing bonuses, and leverage you didn\'t know you had.',
  card6Tag: 'Both',
  card6Title: 'Rejection Doesn\'t Mean You Did It Wrong',
  card6Excerpt: 'You can do everything right and still get rejected. How to process it and keep moving.',

  // Footer
  footerCta: "Let's\nconnect",
  footerCredit: 'Jose x Jocelyn © 2026',
  footerPrivacy: 'Privacy',
  footerTerms: 'Terms',

  // Modal
  modalTitle: 'Get in touch',
  modalNameLabel: 'Full name',
  modalNamePlaceholder: 'Your full name',
  modalEmailLabel: 'Email address',
  modalEmailPlaceholder: 'Your email',
  modalMessageLabel: 'Message',
  modalMessagePlaceholder: "What's on your mind?",
  modalSend: 'Send message →',
  modalSending: 'Sending…',
  modalSentTitle: 'Message sent.',
  modalSentMsg: "Thanks for reaching out! We'll get back to you soon.",
  modalClose: 'Close',

  // Pinata break messages
  breakMsgs: [
    "Échale ganas, you already took the first step.",
    "Nobody gave us the blueprint either. That's why we built this.",
    "Ya llegaste. The sun rises for you too.",
    "First-gen is not a limitation. It's the origin story.",
    "No palancas needed. Just you and this community.",
  ],
},
```

- [ ] **Step 5: Add `home` namespace to es.js**

```js
home: {
  // Hero
  heroFoot1: 'Primera generación',
  heroFoot2: 'Mexicano-Americano',
  heroFoot3: 'Carreras en tecnología',

  // Intro
  introText: 'Somos dos mexicano-americanos de primera generación en tecnología que navegamos cada hito profesional sin un mapa. Sin conexiones heredadas. Sin familia en la industria. Sin nadie a quien llamar cuando la carta de oferta no tenía sentido. Esta plataforma existe para construir lo que nunca tuvimos: un camino visible del campus a la carrera, narrado por dos personas en distintas etapas del mismo recorrido.',

  // About section
  aboutNumber: '02',
  aboutTitle: 'Quiénes Somos',
  aboutTabWhoWeAre: 'Quiénes Somos',
  aboutTabMission: 'Misión',
  aboutTabVision: 'Visión',
  aboutSubtitle: 'Un camino, dos perspectivas',
  aboutIntro: '<em>From Campus to Career</em> es una iniciativa colaborativa liderada por Jose G. Cruz‑Lopez y Jocelyn Vazquez. Juntos, convierten la experiencia vivida en una guía que ayuda a estudiantes de primera generación y grupos subrepresentados a avanzar con confianza del campus a la carrera.',
  joseLabel: 'La Perspectiva Estudiantil',
  joseName: 'Jose G. Cruz‑Lopez',
  joseRole: 'Abriéndose paso',
  joseDesc: 'Estudiante universitario de primera generación que ayuda a sus compañeros a conseguir pasantías y oportunidades tempranas. Activamente en el proceso de reclutamiento y documentando cada paso del camino estudiantil en tiempo real.',
  joseTags: ['Pasantías', 'Solicitudes', 'Becas', 'Vida Estudiantil'],
  jocelynLabel: 'La Perspectiva Post‑Grado',
  jocelynName: 'Jocelyn Vazquez',
  jocelynRole: 'Escalando peldaños',
  jocelynDesc: 'Egresada de primera generación en Sistemas de Información, ahora trabajando en tecnología y datos. Traduciendo las partes "misteriosas" (compensación, cultura corporativa, crecimiento profesional) en orientación accesible para la primera generación.',
  jocelynTags: ['Empleos de Tiempo Completo', 'Negociación', 'Crecimiento Profesional', 'Integración Laboral'],
  aboutClosing: 'Más que una idea, <em>From Campus to Career</em> es un movimiento impulsado por claridad, oportunidad y comunidad.',
  missionLabel: 'Por qué construimos esto y para quién es',
  missionQuote: 'Nadie debería tener que <em>adivinar</em> su camino desde la primera pasantía hasta la primera oferta. Cada paso debe ser <em>visible, trazado</em> y <em>apoyado por la comunidad.</em>',
  missionAttribution: 'Jose y Jocelyn',
  missionBody: 'Nuestra misión es empoderar a los estudiantes de primera generación y grupos subrepresentados para que naveguen con confianza cada etapa, desde su primera búsqueda de pasantía hasta su primer empleo de tiempo completo en tecnología y datos. Hacemos el camino transparente, accionable e impulsado por la comunidad, porque nadie debería adivinar el camino hacia la oportunidad.',
  visionBody: 'Imaginamos un futuro donde cada estudiante de primera generación se gradúe no solo con habilidades, sino con dirección, respaldado por una red que transforma la incertidumbre en posibilidad y la ambición en éxito a largo plazo.',

  // C2C section
  c2cLead: 'Un camino estructurado que convierte la ambición de la primera generación en resultados reales de carrera.',
  c2cCards: [
    { n: '01', t: 'Contenido', d: 'Serie de LinkedIn en pantalla dividida y plantillas de carrera listas para usar. Conversación real desde ambos lados del camino, sin rodeos.' },
    { n: '02', t: 'Sprints', d: 'Programas de cohortes pequeñas enfocados en un hito profesional específico. El Sprint del Año Puente y la Preparación para Entrevistas te mantienen responsable y en movimiento.' },
    { n: '03', t: 'Comunidad', d: 'Tablero de oportunidades curado, paneles con socios, red de conversaciones informativas y círculos de revisión de currículum. Conexiones reales, no solo un chat grupal.' },
    { n: '04', t: 'La Voz del Día', d: 'Artículos sobre reclutamiento, pasantías, ofertas de tiempo completo y supervivencia de primera generación. Escritos por ambos desde los dos lados del puente.' },
  ],
  c2cClosing: '“El camino no se encuentra, se construye. Paso a paso, juntos.”',

  // Services section
  pinataAriaLabel: 'Golpea la piñata',
  pinataPrompt: '¡Haz clic para golpear!',
  servicesTabContent: 'Contenido',
  servicesTabSprints: 'Sprints',
  servicesTabCommunity: 'Comunidad',
  servicesContentBody: 'Nuestra estrategia de contenido prioriza la claridad, la difusión y el valor real. Eso significa perspectivas en pantalla dividida, plantillas accionables y conocimientos honestos sobre reclutamiento, sin relleno.',
  servicesSprintsBody: 'Programas basados en sprints que llevan a pequeñas cohortes a través de un hito profesional específico. Bloques de solicitud semanales, sesiones de responsabilidad, preparación para entrevistas y talleres de narración.',
  servicesCommunityBody: 'Apoyo impulsado por la comunidad, basado en responsabilidad y conexiones reales. Tableros de oportunidades, paneles de socios, redes de conversaciones informativas y círculos de revisión de currículum.',

  // Interruption section
  interrLines: ['Transparente.', 'Accionable.', 'Comunidad', 'Impulsada.'],

  // Editorial section
  editorialLabel: 'Centro de Conocimiento',
  editorialTitle: 'La Voz del Día',
  editorialDesc: 'Artículos sobre reclutamiento, pasantías, ofertas de tiempo completo y supervivencia en los primeros años de carrera, escritos por ambos desde los dos lados del puente.',
  editorialViewAll: 'Ver Todos los Artículos',
  card1Tag: 'Jose',
  card1Title: 'Pasantías de Último Momento: Dónde Buscar Cuando Todos Dicen que Ya Terminó',
  card1Excerpt: 'Es abril y aún no tienes pasantía. Esto es lo que debes hacer ahora mismo.',
  card2Tag: 'Jocelyn',
  card2Title: 'Tus Primeros 90 Días: Guía de Supervivencia para Profesionales de Primera Generación',
  card2Excerpt: 'Nadie te enseña cómo leer los beneficios, navegar la política de la oficina o construir una trayectoria profesional. Hasta ahora.',
  card3Tag: 'Ambos',
  card3Title: 'La Guía Completa de Pasantías para la Primera Generación',
  card3Excerpt: 'Desde el descubrimiento hasta la oferta firmada, sin endulzar nada. Todo lo que aprendimos.',
  card4Tag: 'Jose',
  card4Title: 'El Sistema de Conversaciones Informativas que Realmente Obtiene Respuestas',
  card4Excerpt: 'Un sistema paso a paso para contactar a profesionales y convertir conversaciones en oportunidades.',
  card5Tag: 'Jocelyn',
  card5Title: 'Cómo Negociar Cuando Nunca Has Visto un Salario de Seis Cifras',
  card5Excerpt: 'La compensación incluye beneficios, acciones, bonos de firma y ventajas que no sabías que tenías.',
  card6Tag: 'Ambos',
  card6Title: 'El Rechazo No Significa que lo Hiciste Mal',
  card6Excerpt: 'Puedes hacer todo bien y aun así ser rechazado. Cómo procesarlo y seguir adelante.',

  // Footer
  footerCta: "Conectemos",
  footerCredit: 'Jose x Jocelyn © 2026',
  footerPrivacy: 'Privacidad',
  footerTerms: 'Términos',

  // Modal
  modalTitle: 'Escríbenos',
  modalNameLabel: 'Nombre completo',
  modalNamePlaceholder: 'Tu nombre completo',
  modalEmailLabel: 'Correo electrónico',
  modalEmailPlaceholder: 'Tu correo',
  modalMessageLabel: 'Mensaje',
  modalMessagePlaceholder: '¿Qué tienes en mente?',
  modalSend: 'Enviar mensaje →',
  modalSending: 'Enviando…',
  modalSentTitle: 'Mensaje enviado.',
  modalSentMsg: '¡Gracias por escribirnos! Te responderemos pronto.',
  modalClose: 'Cerrar',

  // Pinata break messages (mix English/Spanish intentionally — bilingual flavor)
  breakMsgs: [
    "Échale ganas, ya diste el primer paso.",
    "Nosotros tampoco tuvimos el manual. Por eso construimos esto.",
    "Ya llegaste. El sol también sale para ti.",
    "Ser primera generación no es una limitación. Es el origen de tu historia.",
    "No se necesitan palancas. Solo tú y esta comunidad.",
  ],
},
```

- [ ] **Step 6: Update Home.jsx — import useLang and useT**

At the top of `src/pages/Home.jsx`, after the existing imports, add:
```js
import { useLang } from '../context/LanguageContext'
import { useT } from '../hooks/useT'
```

Inside the `Home` component, after `const navigate = useNavigate()`, add:
```js
const { lang, setLang } = useLang()
const t = useT('home')
const tNav = useT('nav')
```

- [ ] **Step 7: Add language toggle button to nav**

In the nav's `<div className="nav__links">`, immediately before the existing `<button className="nav__search-btn"...>`:

```jsx
<button
  className="nav__lang-btn"
  onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
  aria-label={tNav.langToggleLabel}
>
  <span className={lang === 'en' ? 'nav__lang-active' : 'nav__lang-inactive'}>EN</span>
  <span className="nav__lang-sep"> · </span>
  <span className={lang === 'es' ? 'nav__lang-active' : 'nav__lang-inactive'}>ES</span>
</button>
```

Also add the same button to the mobile nav `<div className="mobile-nav...">` after the search button there.

- [ ] **Step 8: Replace all hardcoded strings in Home.jsx with t.key / tNav.key**

Work through every visible string in Home.jsx top to bottom and replace:

- Nav links: `{tNav.about}`, `{tNav.services}`, `{tNav.getInTouch}`, `{tNav.laVoz}`, dropdown labels/items
- Search: `placeholder={tNav.searchPlaceholder}`, no-results: `` `${tNav.searchNoResults} "${searchQuery}"` ``
- Burger aria-label: `{menuOpen ? tNav.closeMenu : tNav.openMenu}`
- Hero foot spans: `{t.heroFoot1}`, `{t.heroFoot2}`, `{t.heroFoot3}`
- Intro text: `{t.introText}`
- About title: `{t.aboutTitle}`, about tabs, tab panels — use `dangerouslySetInnerHTML={{ __html: t.aboutIntro }}` for the intro paragraph, `t.joseLabel`, `t.joseName`, etc.
- C2C section: `{t.c2cLead}`, map `t.c2cCards` instead of the hardcoded array, `{t.c2cClosing}`
- Pinata: `aria-label={t.pinataAriaLabel}`, prompt: `{t.pinataPrompt}`, break messages: use `t.breakMsgs` array instead of `BREAK_MSGS`
- Services tabs: `{t.servicesTabContent}`, bodies: `{t.servicesContentBody}`, etc.
- Interruption lines: map `t.interrLines` instead of the hardcoded array
- Editorial: `{t.editorialLabel}`, `{t.editorialTitle}`, `{t.editorialDesc}`, card titles/excerpts/tags, `{t.editorialViewAll}`
- Footer: `{t.footerCta}`, `{t.footerCredit}`, `{t.footerPrivacy}`, `{t.footerTerms}`
- Modal: `{t.modalTitle}`, placeholders, labels, button text

- [ ] **Step 9: Verify in browser**

Run `npm run dev`. Toggle EN ↔ ES and confirm every string on the home page switches. Check: hero, about tabs, services tabs, c2c cards, editorial cards, footer, modal.

- [ ] **Step 10: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/Home.jsx
git commit -m "feat: add EN/ES toggle to nav, translate Home page"
```

---

## Task 4: BridgeYear.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `bridgeYear` namespace)
- Modify: `src/translations/es.js` (add `bridgeYear` namespace)
- Modify: `src/pages/BridgeYear.jsx`

- [ ] **Step 1: Read BridgeYear.jsx in full**

Read all 1107 lines of `src/pages/BridgeYear.jsx`. Identify every user-visible string: page title, section headings, body text, card descriptions, tab labels, button labels, form text, opportunity names and descriptions, resource names, CTA text, footer area.

- [ ] **Step 2: Add `bridgeYear` namespace to en.js**

Extract all visible strings from BridgeYear.jsx into `en.bridgeYear`. Organize as a flat object with descriptive keys (e.g. `heroTitle`, `heroSubtitle`, `whatIsBody`, `phaseHeadings`, etc.). For data arrays (opportunity cards, resource list), use arrays of objects with the same shape as the original. Keep the key names clear and descriptive.

- [ ] **Step 3: Add `bridgeYear` namespace to es.js**

Translate every string from `en.bridgeYear` into professional Mexican-American Spanish. Career-specific terms:
- "Bridge Year Sprint" → keep as "Sprint del Año Puente"
- "fellowship" → "beca de formación"
- "internship" → "pasantía"
- "application" → "solicitud"
- "cohort" → "cohorte"
- "accountability" → "responsabilidad mutua"

- [ ] **Step 4: Update BridgeYear.jsx**

```js
import { useT } from '../hooks/useT'
// inside component:
const t = useT('bridgeYear')
```

Replace every hardcoded visible string with `t.key`. For data arrays, map `t.opportunityCards` or equivalent instead of the hardcoded array.

- [ ] **Step 5: Verify in browser**

Navigate to `/bridge-year`. Toggle EN ↔ ES. Confirm all sections switch: hero, what-is, phases, opportunities, resources, CTA.

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/BridgeYear.jsx
git commit -m "feat: translate BridgeYear page EN/ES"
```

---

## Task 5: InterviewPrep.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `interviewPrep` namespace)
- Modify: `src/translations/es.js` (add `interviewPrep` namespace)
- Modify: `src/pages/InterviewPrep.jsx`

- [ ] **Step 1: Read InterviewPrep.jsx in full** (987 lines)

- [ ] **Step 2: Add `interviewPrep` namespace to en.js**

Extract all visible strings. Key areas: hero, accordion FAQ items (question + answer for each), track cards, resource items, CTA, footer-area text.

- [ ] **Step 3: Add `interviewPrep` namespace to es.js**

Translate all strings. Career terms:
- "behavioral interview" → "entrevista conductual"
- "technical interview" → "entrevista técnica"
- "STAR method" → "método STAR"
- "mock interview" → "entrevista de práctica"
- "coding challenge" → "prueba de código"

- [ ] **Step 4: Update InterviewPrep.jsx — import useT, replace strings with t.key**

- [ ] **Step 5: Verify at `/interview-prep` — toggle and check all sections**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/InterviewPrep.jsx
git commit -m "feat: translate InterviewPrep page EN/ES"
```

---

## Task 6: CoffeeChat.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `coffeeChat` namespace)
- Modify: `src/translations/es.js` (add `coffeeChat` namespace)
- Modify: `src/pages/CoffeeChat.jsx`

- [ ] **Step 1: Read CoffeeChat.jsx in full** (950 lines)

- [ ] **Step 2: Add `coffeeChat` namespace to en.js**

Extract all visible strings. Key areas: hero, how-it-works steps, directory listing UI labels (filter labels, search placeholder, empty state), profile card UI elements, CTA text.

- [ ] **Step 3: Add `coffeeChat` namespace to es.js**

Translate all strings. Terms:
- "coffee chat" → "conversación informativa"
- "Coffee Chat Network" → "Red de Conversaciones Informativas"
- "mentor" → "mentor"
- "networking" → "establecer contactos" or keep "networking" where contextually clearer

- [ ] **Step 4: Update CoffeeChat.jsx — import useT, replace strings**

Note: Supabase-fetched profile data (names, bios, companies) is NOT translated — only static UI strings.

- [ ] **Step 5: Verify at `/coffee-chat` — toggle EN ↔ ES**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/CoffeeChat.jsx
git commit -m "feat: translate CoffeeChat page EN/ES"
```

---

## Task 7: OpportunityBoard.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `opportunityBoard` namespace)
- Modify: `src/translations/es.js` (add `opportunityBoard` namespace)
- Modify: `src/pages/OpportunityBoard.jsx`

- [ ] **Step 1: Read OpportunityBoard.jsx in full** (637 lines)

- [ ] **Step 2: Add `opportunityBoard` namespace to en.js**

Extract all visible strings. Key areas: hero text, filter labels, category labels, empty state messages, "apply" button, card UI labels (deadline, type, location), CTA/footer area.

- [ ] **Step 3: Add `opportunityBoard` namespace to es.js**

Translate all strings. Terms:
- "Opportunity Board" → "Tablero de Oportunidades"
- "Apply" → "Solicitar"
- "Deadline" → "Fecha límite"
- "Full-time" → "Tiempo completo"
- "Part-time" → "Medio tiempo"
- "Remote" → "Remoto"
- "Hybrid" → "Híbrido"
- "Internship" → "Pasantía"
- "Fellowship" → "Beca de formación"

Note: Supabase-fetched opportunity titles, company names, and descriptions are NOT translated.

- [ ] **Step 4: Update OpportunityBoard.jsx — import useT, replace static strings**

- [ ] **Step 5: Verify at `/opportunity-board`**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/OpportunityBoard.jsx
git commit -m "feat: translate OpportunityBoard page EN/ES"
```

---

## Task 8: ResumeReviews.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `resumeReviews` namespace)
- Modify: `src/translations/es.js` (add `resumeReviews` namespace)
- Modify: `src/pages/ResumeReviews.jsx`

- [ ] **Step 1: Read ResumeReviews.jsx in full** (1023 lines)

- [ ] **Step 2: Add `resumeReviews` namespace to en.js** — all visible strings

- [ ] **Step 3: Add `resumeReviews` namespace to es.js**

Terms:
- "Resume Reviews" → "Revisión de Currículum"
- "resume" → "currículum"
- "submit" → "enviar"
- "feedback" → "retroalimentación"
- "ATS" → keep "ATS"

- [ ] **Step 4: Update ResumeReviews.jsx — import useT, replace strings**

- [ ] **Step 5: Verify at `/resume-reviews`**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/ResumeReviews.jsx
git commit -m "feat: translate ResumeReviews page EN/ES"
```

---

## Task 9: PartnerPanels.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `partnerPanels` namespace)
- Modify: `src/translations/es.js` (add `partnerPanels` namespace)
- Modify: `src/pages/PartnerPanels.jsx`

- [ ] **Step 1: Read PartnerPanels.jsx in full** (1220 lines)

- [ ] **Step 2: Add `partnerPanels` namespace to en.js** — all visible strings including panel descriptions, RSVP UI, past panels labels, ecosystem section text

- [ ] **Step 3: Add `partnerPanels` namespace to es.js**

Terms:
- "Partner Panels" → "Paneles con Socios"
- "RSVP" → "Confirmar asistencia"
- "Watch recording" → "Ver grabación"
- "upcoming" → "próximos"
- "past events" → "eventos pasados"

Note: Partner company names, panelist names, and Supabase-fetched panel data are NOT translated.

- [ ] **Step 4: Update PartnerPanels.jsx — import useT, replace strings**

- [ ] **Step 5: Verify at `/partner-panels`**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/PartnerPanels.jsx
git commit -m "feat: translate PartnerPanels page EN/ES"
```

---

## Task 10: LinkedInSeries.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `linkedInSeries` namespace)
- Modify: `src/translations/es.js` (add `linkedInSeries` namespace)
- Modify: `src/pages/LinkedInSeries.jsx`

- [ ] **Step 1: Read LinkedInSeries.jsx in full** (268 lines)

- [ ] **Step 2: Add `linkedInSeries` namespace to en.js** — all visible strings

- [ ] **Step 3: Add `linkedInSeries` namespace to es.js**

Terms:
- "LinkedIn Series" → "Serie de LinkedIn"
- "episode" → "episodio"
- "follow" → "seguir"

- [ ] **Step 4: Update LinkedInSeries.jsx — import useT, replace strings**

- [ ] **Step 5: Verify at `/linkedin-series`**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/LinkedInSeries.jsx
git commit -m "feat: translate LinkedInSeries page EN/ES"
```

---

## Task 11: CareerTemplates.jsx translations

**Files:**
- Modify: `src/translations/en.js` (add `careerTemplates` namespace)
- Modify: `src/translations/es.js` (add `careerTemplates` namespace)
- Modify: `src/pages/CareerTemplates.jsx`

- [ ] **Step 1: Read CareerTemplates.jsx in full** (607 lines)

- [ ] **Step 2: Add `careerTemplates` namespace to en.js** — all visible strings including template names, descriptions, category labels, download/open button labels

- [ ] **Step 3: Add `careerTemplates` namespace to es.js**

Terms:
- "Career Templates" → "Plantillas de Carrera"
- "Download" → "Descargar"
- "Open" → "Abrir"
- "template" → "plantilla"
- "cover letter" → "carta de presentación"
- "tracker" → "rastreador"
- "negotiation" → "negociación"

- [ ] **Step 4: Update CareerTemplates.jsx — import useT, replace strings**

- [ ] **Step 5: Verify at `/career-templates`**

- [ ] **Step 6: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/CareerTemplates.jsx
git commit -m "feat: translate CareerTemplates page EN/ES"
```

---

## Task 12: Article pages translations

This covers: `ArticlesIndex.jsx` and all 6 article pages.

**Files:**
- Modify: `src/translations/en.js` (add `articlesIndex`, `rejection`, `firstGenPlaybook`, `first90Days`, `negotiateSalary`, `lateCycleInternships`, `coffeeChatFramework` namespaces)
- Modify: `src/translations/es.js` (same namespaces)
- Modify: all 7 article files

- [ ] **Step 1: Read ArticlesIndex.jsx**

Extract all visible strings to `en.articlesIndex`. Translate to `es.articlesIndex`. Update component with `useT('articlesIndex')`.

- [ ] **Step 2: Read Rejection.jsx**

Extract all visible strings (headline, subhead, all body paragraphs, pull quotes, section headings, back-link label) to `en.rejection`. Translate to `es.rejection`. Article body paragraphs with `<strong>` or `<em>` → use `dangerouslySetInnerHTML`. Update component with `useT('rejection')`.

- [ ] **Step 3: Read FirstGenPlaybook.jsx**

Extract all visible strings to `en.firstGenPlaybook`. Translate to `es.firstGenPlaybook`. Update component with `useT('firstGenPlaybook')`.

- [ ] **Step 4: Read First90Days.jsx**

Extract all visible strings to `en.first90Days`. Translate to `es.first90Days`. Update component with `useT('first90Days')`.

- [ ] **Step 5: Read NegotiateSalary.jsx**

Extract all visible strings to `en.negotiateSalary`. Translate to `es.negotiateSalary`. Terms: "salary" → "salario", "offer" → "oferta", "negotiate" → "negociar", "equity" → "acciones", "signing bonus" → "bono de contratación".

- [ ] **Step 6: Read LateCycleInternships.jsx**

Extract all visible strings to `en.lateCycleInternships`. Translate to `es.lateCycleInternships`.

- [ ] **Step 7: Read CoffeeChatFramework.jsx**

Extract all visible strings to `en.coffeeChatFramework`. Translate to `es.coffeeChatFramework`.

- [ ] **Step 8: Verify all articles**

Visit each article URL. Toggle EN ↔ ES. Confirm full article text switches in both directions.

- [ ] **Step 9: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/pages/articles/
git commit -m "feat: translate all article pages EN/ES"
```

---

## Task 13: Components — ArticleLayout + ArticleSubscribe

**Files:**
- Modify: `src/translations/en.js` (add `articleLayout` namespace)
- Modify: `src/translations/es.js` (add `articleLayout` namespace)
- Modify: `src/components/ArticleLayout.jsx`
- Modify: `src/components/ArticleSubscribe.jsx`

- [ ] **Step 1: Read ArticleLayout.jsx and ArticleSubscribe.jsx**

- [ ] **Step 2: Add `articleLayout` namespace to en.js**

```js
articleLayout: {
  backLabel: '← Articles',
  subscribeTitle: 'Stay in the loop',
  subscribeBody: 'Get new articles, opportunities, and resources delivered to your inbox.',
  subscribePlaceholder: 'Your email',
  subscribeBtn: 'Subscribe',
  subscribeSuccess: 'You\'re in!',
},
```

(Adjust the exact strings after reading the actual files.)

- [ ] **Step 3: Add `articleLayout` namespace to es.js**

```js
articleLayout: {
  backLabel: '← Artículos',
  subscribeTitle: 'Mantente al tanto',
  subscribeBody: 'Recibe nuevos artículos, oportunidades y recursos en tu correo.',
  subscribePlaceholder: 'Tu correo',
  subscribeBtn: 'Suscribirme',
  subscribeSuccess: '¡Ya estás dentro!',
},
```

- [ ] **Step 4: Update ArticleLayout.jsx and ArticleSubscribe.jsx with useT('articleLayout')**

- [ ] **Step 5: Verify on any article page — back link, subscribe form**

- [ ] **Step 6: Final end-to-end pass**

Navigate to every page (/, /bridge-year, /interview-prep, /coffee-chat, /opportunity-board, /resume-reviews, /partner-panels, /linkedin-series, /career-templates, /articles, each article). Toggle EN → ES. Toggle back EN. Confirm: no string stays in English when ES is selected, no layout breaks, localStorage persists on refresh.

- [ ] **Step 7: Commit**

```bash
git add src/translations/en.js src/translations/es.js src/components/
git commit -m "feat: translate ArticleLayout and ArticleSubscribe components EN/ES"
```

---

## Task 14: Final push

- [ ] **Step 1: Full smoke test**

Open the app. Toggle to ES. Click through every page and every tab/accordion. Verify no `undefined` values render (these appear as blank — would indicate a missing translation key).

- [ ] **Step 2: Check localStorage persistence**

Set to ES. Hard-refresh. Confirm ES is still active.

- [ ] **Step 3: Push to remote**

```bash
git push origin main
```
