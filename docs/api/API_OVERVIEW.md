# chseets - Public API Overview

The **chseets API** provides programmatic access to published cheat sheet
metadata and content. It is designed for read-only public use and lightweight
integrations (search, list, fetch).

> Base URL: **[https://chseets.com/api/](https://chseets.com/api/)**  
> Status: **Preview** — breaking changes may occur without notice.

---

## 1. Summary

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/sheets` | List all available sheets (paginated) |
| `GET` | `/sheets/{slug}` | Fetch one sheet’s metadata and content |
| `POST` | `/search` | Search sheets by text or tags |
| `GET` | `/meta` | API version, timestamp, and build info |

All responses are JSON. Rate limiting may apply.

---

## 2. Authentication

Currently **no authentication** is required for public read endpoints.  
Future versions may use API keys for write or moderation operations.

---

## 3. Headers

| Header | Required | Description |
|---------|-----------|-------------|
| `Accept: application/json` | ✅ | Specify JSON output |
| `User-Agent` | ✅ | Identify your client |
| `If-None-Match` | ❌ | Enable caching with ETag |

---

## 4. Example requests

### List all sheets

```bash
curl https://chseets.com/api/sheets
```

Response

```json
{
  "count": 124,
  "results": [
    {
      "title": "QBasic Basics",
      "slug": "qbasic-basics",
      "language": "en",
      "level": "beginner",
      "tags": ["programming", "basic", "qbasic"],
      "summary": "Core syntax and I/O patterns for QBasic.",
      "updated_at": "2025-10-21"
    }
  ]
}
```

Get one sheet

```bash
curl https://chseets.com/api/sheets/qbasic-basics
```

Response

```json
{
  "title": "QBasic Basics",
  "slug": "qbasic-basics",
  "language": "en",
  "content": "# PRINT, INPUT, and basic loops...",
  "version": "1.0.0",
  "created_at": "2025-10-21",
  "updated_at": "2025-10-21"
}
```

Search sheets

```bash
curl -X POST https://chseets.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "linux network"}'
```

Response

```json
{
  "results": [
    { "slug": "linux-networking", "title": "Linux Networking Basics" },
    { "slug": "tcp-ip-quickref", "title": "TCP/IP Quick Reference" }
  ]
}
```

---

## 5. Rate limits

- Soft limit: 60 requests/minute per IP
- Heavy use may be throttled; use local caching when possible.
- Abuse (scraping, spam queries) results in temporary ban.

---

## 6. Error model

| Code  | Meaning           | Example               |
| ----- | ----------------- | --------------------- |
| `400` | Bad request       | invalid query or JSON |
| `404` | Not found         | unknown slug          |
| `429` | Too many requests | rate limit hit        |
| `500` | Server error      | unexpected failure    |

Response example

```json
{
  "error": {
    "code": 404,
    "message": "Sheet not found"
  }
}
```

---

## 7. Versioning

The API version is available at /api/meta and follows date-based tags:

```json
{
  "version": "2025-10-21",
  "commit": "a1b2c3d",
  "timestamp": "2025-10-21T14:30:00Z"
}
```

When major breaking changes occur, the base path may change, e.g.:

```ini
https://chseets.com/api/v2/
```

---

## 8. CORS

```ini
CORS is enabled for safe GET/POST operations.
Allowed methods: GET, POST, OPTIONS
Allowed headers: Accept, Content-Type, Origin
```

---

## 9. Planned endpoints

| Method | Endpoint     | Purpose                           |
| ------ | ------------ | --------------------------------- |
| `GET`  | `/tags`      | list all tags and counts          |
| `GET`  | `/languages` | list supported languages          |
| `POST` | `/report`    | submit content flag or correction |
| `GET`  | `/random`    | return one random sheet           |

---

## 10. Terms of use

- No bulk mirroring without consent.
- Always attribute chseets.com when redistributing data.
- Respect the robots.txt and rate limits.

```yaml
## FILE: docs/api/openapi.yaml
openapi: 3.1.0
info:
  title: chseets Public API
  version: "2025-10-21"
  description: |
    Read-only API for accessing published cheat sheet metadata and content.
    All responses are JSON. Authentication is not required for public endpoints.
servers:
  - url: https://chseets.com/api
    description: Production API

paths:
  /sheets:
    get:
      summary: List all sheets
      parameters:
        - in: query
          name: page
          schema:
            type: integer
            minimum: 1
          description: Page number (default 1)
        - in: query
          name: limit
          schema:
            type: integer
            default: 50
            maximum: 200
          description: Results per page
      responses:
        "200":
          description: List of sheets
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                  results:
                    type: array
                    items:
                      $ref: "#/components/schemas/SheetSummary"

  /sheets/{slug}:
    get:
      summary: Retrieve one sheet by slug
      parameters:
        - in: path
          name: slug
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Full sheet data
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/SheetFull"
        "404":
          description: Sheet not found

  /search:
    post:
      summary: Search sheets by text or tags
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  example: "linux network"
      responses:
        "200":
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      $ref: "#/components/schemas/SheetSummary"
        "400":
          description: Invalid query

  /meta:
    get:
      summary: API metadata and version info
      responses:
        "200":
          description: Version data
          content:
            application/json:
              schema:
                type: object
                properties:
                  version:
                    type: string
                  commit:
                    type: string
                  timestamp:
                    type: string
                    format: date-time

components:
  schemas:
    SheetSummary:
      type: object
      properties:
        title:
          type: string
        slug:
          type: string
        language:
          type: string
        level:
          type: string
          enum: [beginner, intermediate, advanced]
        tags:
          type: array
          items: { type: string }
        summary:
          type: string
        updated_at:
          type: string
          format: date
    SheetFull:
      allOf:
        - $ref: "#/components/schemas/SheetSummary"
        - type: object
          properties:
            content:
              type: string
            version:
              type: string
            created_at:
              type: string
              format: date
            references:
              type: array
              items:
                type: string
```

---
