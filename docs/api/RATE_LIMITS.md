# chseets - API Rate Limits & Fair Use Policy

This document defines the default **rate limits** and **fair use rules** for
accessing the public chseets API at [https://chseets.com/api/](https://chseets.com/api/).

The limits are designed to keep the service fast and stable for everyone while
allowing reasonable open access for developers and educators.

---

## General policy

- All requests are subject to fair-use monitoring.
- Excessive or automated scraping will trigger throttling or temporary bans.
- The API is intended for **human-facing applications**, not large-scale data
  replication.

---

## Global limits

| Limit type | Value | Scope | Notes |
|-------------|--------|--------|-------|
| **Requests per minute** | 60 | per IP | Soft limit, may vary per endpoint |
| **Burst window** | 10 | per second | Short peaks allowed |
| **Daily cap** | 5,000 | per IP | Heavy users should request extended access |
| **Concurrent connections** | 4 | per IP | Additional connections are queued |

If limits are exceeded, the server returns **HTTP 429 Too Many Requests** with a
`Retry-After` header (in seconds).

## Example

```js
HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/json

{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded. Please retry after 30 seconds."
  }
}
```

## Endpoint-specific hints

| Endpoint             | Typical usage     | Suggested delay         |
| -------------------- | ----------------- | ----------------------- |
| `GET /sheets`        | Listing metadata  | ≥ 1s between requests   |
| `GET /sheets/{slug}` | Fetching content  | ≥ 0.5s between requests |
| `POST /search`       | Search operations | ≥ 1.5s between requests |
| `GET /meta`          | Version info      | Cache for ≥ 10min       |

---

## Caching guidelines

- To minimize load and improve performance:
- Use ETag or Last-Modified headers to avoid repeated downloads.
- Cache list results for at least 60 seconds.
- Cache metadata (/meta) for 10–30 minutes.
- Avoid background polling; use manual refresh or conditional requests.

## Identification

Always send a User-Agent header that identifies your app or library.

Example:

```sql
User-Agent: myapp/1.0 (contact@example.com)
```

Requests without identification may be deprioritized.

## Abuse handling

Excessive or abusive behavior includes:

- Continuous scraping or brute-force enumeration
- Ignoring Retry-After headers
- Using fake or rotating IPs to bypass limits
- Automated redistribution of the full dataset

---

> **Violations may lead to temporary or permanent IP blocking.**
---
> For legitimate high-volume use (e.g., research, education, integration),
contact the maintainers via the email listed in SECURITY.md or on
[https://chseets.com/about/](https://chseets.com/about/)

---

## 7. Transparency & changes

The rate-limit policy may evolve. Changes will be announced via:

- The /api/meta version field
- The repository CHANGELOG.md

---

## 8. TL;DR

- Default: 60 req/min per IP
- Respect Retry-After
- Identify your client
- Cache responses when possible
- Don’t scrape everything

> **Keep it friendly. We like open data, not melted servers.**
