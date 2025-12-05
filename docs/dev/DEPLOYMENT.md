# chseets - Deployment Guide

How to deploy the chseets site and API on a Debian + Caddy environment.

---

## 1. Server prerequisites

| Component | Purpose |
|------------|----------|
| Debian 12 (headless) | base OS |
| Caddy 2 | HTTPS + static file server |
| Node.js 20 (optional) | API helpers / validation scripts |
| Tailscale VPN (optional) | secure remote access |

---

## 2. Folder layout on server

```ini
/srv/chseets/
├─ www/ → public site (PWA)
├─ api/ → JSON & YAML data
├─ logs/
└─ backups/
```

---

## 3. Caddy configuration example

```caddyfile
chseets.com {
    root * /srv/chseets/www
    encode gzip
    file_server
    handle_path /api/* {
        root * /srv/chseets
        file_server
    }
    tls {
        issuer acme
    }
}
```

## 4. Deploy steps

```bash
# 1. Pull latest repo
git -C /srv/chseets pull origin main

# 2. Reload Caddy
sudo systemctl reload caddy

# 3. Validate specs
npx swagger-cli validate /srv/chseets/docs/api/openapi.yaml
jq . /srv/chseets/docs/specs/sheet.schema.json
```

## 5. Troubleshooting

| Issue           | Fix                                               |
| --------------- | ------------------------------------------------- |
| Caddy fails TLS | check DNS A / AAAA records and firewall (80, 443) |
| PWA offline     | clear service-worker cache                        |
| API not loading | validate YAML + JSON syntax again                 |

_Last updated: 2025-10-21_
