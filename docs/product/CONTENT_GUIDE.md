# chseets - Content & Style Guide

Guidelines for creating clear, consistent, and readable cheat sheets.

---

## 1. General principles

- **Accuracy first.** Verify each statement with reliable sources.  
- **Clarity.** Use short sentences and minimal jargon.  
- **Neutral tone.** No promotion, bias, or opinion.  
- **Print readability.** 1–2 A4 pages max.  

---

## 2. Formatting

| Element | Rule |
|----------|------|
| **Headings** | use `#`, `##`, `###` hierarchy |
| **Lists** | short, parallel structure |
| **Tables** | keep within A4 width; use code font for literals |
| **Code blocks** | specify language (```bash,```sql, …) |
| **Emphasis** | use `**bold**` sparingly; avoid all caps |
| **Links** | always in Markdown format – e.g. [https://chseets.com](https://chseets.com) |

---

## 3. Language & tone

- Prefer **active voice** (“Run the command”)  
- Avoid redundancy and filler words  
- Keep tense consistent within sections  

---

## 4. Structure

Each sheet must contain:

1. YAML front matter (see SHEET_SPEC.md)  
2. Title + summary  
3. Sections with headings and lists  
4. Optional examples and references  

---

## 5. References

At the end of each sheet, include:

```markdown
## References
- [Primary documentation](https://example.com)
- [Secondary source](https://example.org)
```

---

## 6. Localization

> Translations must preserve meaning, not literal phrasing.
> Add language: code in the front matter and keep consistent slug format.

## 7. Review process

Each new sheet is reviewed by maintainers or community members.

Approved sheets are merged and appear on the site within 24 hours.

_Last updated: 2025-10-21_
