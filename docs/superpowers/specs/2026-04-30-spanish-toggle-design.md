# Spanish Language Toggle — Design Spec
**Date:** 2026-04-30  
**Status:** Approved

---

## Overview

Add a persistent EN/ES language toggle to the navbar that switches the entire website between English and Spanish. The user's language choice is saved to localStorage and restored on every visit. All page content — headings, body text, card descriptions, article text, UI labels — is translated.

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `src/context/LanguageContext.jsx` | React context holding `lang` ('en'\|'es') and `setLang`. Reads/writes localStorage key `jj-lang`. Default: `'en'`. |
| `src/hooks/useT.js` | `useT(namespace)` — reads `lang` from context, returns `translations[lang][namespace]` |
| `src/translations/en.js` | All English strings, keyed by namespace then string name |
| `src/translations/es.js` | All Spanish strings, same structure |

### Modified files

- `src/App.jsx` — wrap app in `<LanguageProvider>`
- `src/pages/Home.jsx` — add toggle button to nav; use `useT('home')` throughout
- All other pages and components — use `useT('<pageName>')` for all rendered text

### Data flow

```
User clicks toggle
  → setLang('es') in context
  → localStorage.setItem('jj-lang', 'es')
  → every useT() consumer re-renders with Spanish strings
```

On app load: `LanguageContext` reads `localStorage.getItem('jj-lang') ?? 'en'` as initial state.

---

## Translation namespaces

Each page/component maps to one namespace key in `en.js` / `es.js`:

| Namespace | File |
|-----------|------|
| `nav` | Home.jsx nav section |
| `home` | Home.jsx all sections |
| `bridgeYear` | BridgeYear.jsx |
| `interviewPrep` | InterviewPrep.jsx |
| `opportunityBoard` | OpportunityBoard.jsx |
| `coffeeChat` | CoffeeChat.jsx |
| `resumeReviews` | ResumeReviews.jsx |
| `partnerPanels` | PartnerPanels.jsx |
| `linkedInSeries` | LinkedInSeries.jsx |
| `careerTemplates` | CareerTemplates.jsx |
| `articlesIndex` | ArticlesIndex.jsx |
| `articleLayout` | ArticleLayout.jsx, ArticleSubscribe.jsx |
| `rejection` | Rejection.jsx |
| `firstGenPlaybook` | FirstGenPlaybook.jsx |
| `first90Days` | First90Days.jsx |
| `negotiateSalary` | NegotiateSalary.jsx |
| `lateCycleInternships` | LateCycleInternships.jsx |
| `coffeeChatFramework` | CoffeeChatFramework.jsx |

---

## Toggle button

- **Location:** immediately left of the search icon in `.nav__links`
- **Appearance:** `EN · ES` pill — active language full-opacity, inactive dimmed (0.45 opacity)
- **Color:** inherits nav text color (white on hero, dark on scroll)
- **Mobile:** placed in the mobile search row alongside the mobile search button
- **Behavior:** single click toggles; no page reload; instant re-render

---

## Translation approach

- Language: neutral Mexican-American professional Spanish
- Register: matches the audience — first-gen college students, Latinx professionals
- Recruiting jargon translated contextually (e.g. "Bridge Year Sprint" stays as-is, "coffee chat" → "conversación informativa")
- HTML entities (non-breaking hyphens `&#8209;`, `&amp;`, etc.) preserved in Spanish strings
- JSX with inline `<strong>`, `<br/>` tags — translated strings keep the same markup structure
- Dynamic content (Supabase-fetched opportunity listings, user-generated data) is NOT translated — only static UI text

---

## What is NOT translated

- Supabase-fetched data (job listings, opportunity cards, user submissions)
- Image alt text that describes a photo literally (kept in English)
- External links and partner logos
- The search keyword arrays (used internally, not displayed)

---

## Acceptance criteria

1. Clicking ES switches every visible string on the current page to Spanish
2. Clicking EN switches back to English
3. Refreshing the page restores the last chosen language
4. No layout breaks in either language (Spanish strings may be longer — UI must accommodate)
5. All 10+ pages and article pages are fully translated
6. Nav toggle button matches existing nav styling in both hero and scrolled states
