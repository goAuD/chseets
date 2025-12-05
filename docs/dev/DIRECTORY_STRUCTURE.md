# chseets - Directory Structure

A reference map of the repository layout and purpose of each folder.

---

```ini
chseets/
├─ .github/ → workflows, issue & PR templates
├─ brand/ → logo, icons, and design assets
├─ docs/
│ ├─ api/ → API documentation and OpenAPI spec
│ ├─ dev/ → development & deployment guides
│ ├─ product/ → community, content, moderation docs
│ ├─ specs/ → schema definitions
│ └─ legal/ → imprint, privacy, terms
├─ sheets/ → community-contributed cheat sheets
│ ├─ examples/ → sample content
│ └─ index.json → sheet registry
├─ templates/ → reusable content templates
├─ tools/ → validation and build scripts
├─ LICENSE-CODE → Apache 2.0
├─ LICENSE-CONTENT → CC BY 4.0
├─ README.md
└─ CHANGELOG.md
```

---

## Notes

- Keep filenames lowercase and hyphen-separated.  
- All paths are relative to repo root.  
- CI expects the schema and OpenAPI files under `/docs/specs/` and `/docs/api/`.  

---

_Last updated: 2025-10-21_
