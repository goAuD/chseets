# chseets - SEO & Accessibility Guidelines

Ensures chseets content is discoverable and usable by all users.

---

## 1. SEO Basics

| Aspect | Practice |
|--------|-----------|
| **Title tags** | concise (50–60 chars), descriptive |
| **Meta description** | 150–160 chars summary per page |
| **Canonical URLs** | use consistent slugs |
| **Sitemap** | auto-generated under `/sitemap.xml` |
| **Robots.txt** | allows indexing of `/sheets/`, disallows `/api/` |

---

## 2. Schema metadata

Add structured data (JSON-LD) for cheat sheets:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Linux Networking Basics",
  "author": "Community Contributors",
  "inLanguage": "en",
  "license": "https://creativecommons.org/licenses/by/4.0/"
}
</script>
```

## 3. Accessibility checklist

| Area             | Requirement               |
| ---------------- | ------------------------- |
| **Contrast**     | meet WCAG 2.1 AA          |
| **Font size**    | ≥14px web / ≥10pt print   |
| **Alt text**     | for all images            |
| **Keyboard nav** | all UI accessible via Tab |
| **ARIA labels**  | use for icons and buttons |

---

## 4. Testing tools

- <https://wave.webaim.org> - accessibility audit
- <https://pagespeed.web.dev> - performance + SEO score
- <https://search.google.com/test/mobile-friendly> - mobile usability check

_Last updated: 2025-10-21_
