# Docker Proxy

A set of Docker services for an **HTTP proxy (Squid)** and **server-side web page rendering** (Puppeteer / Crawlee), plus an optional **remote desktop** image with RDP. The project is meant to be deployed with Docker Compose from the directories under `opt/`.

## Layout

| Directory   | Purpose |
|------------|---------|
| `opt/proxy` | Squid with Basic auth, port **3128** |
| `opt/scrapper` | HTTP API on Express + Puppeteer (stealth), port **3000** |
| `opt/scrapper_v2` | Same idea via **Crawlee** + Puppeteer, port **3000** |
| `opt/remote` | Debian + XFCE + **xrdp** (RDP **3389**); the image also includes Squid/Chromium for “desktop + proxy” scenarios |

## Requirements

- Docker and Docker Compose v2
- For building the scrapers: enough resources for Chromium (consider raising container memory limits if needed)

## Quick start

Run commands from the matching directory.

### Squid proxy

```bash
cd opt/proxy
cp .env.example .env
# edit .env: PROXY_USER, PROXY_PASS
docker compose up -d --build
```

Clients use an HTTP proxy on the host: `host:3128`. Username and password are set at image build time via `PROXY_USER` and `PROXY_PASS` in `opt/proxy/.env` (see `.env.example`). The `.env` file is not committed to git.

### Scraper v1 (Puppeteer API)

```bash
cd opt/scrapper
docker compose up -d --build
```

- Endpoint: `GET /render?url=<encoded_url>`
- Auth: `Authorization: Bearer <token>` header (the token is hardcoded in `server.js`—move it to environment variables before production).

### Scraper v2 (Crawlee)

```bash
cd opt/scrapper_v2
docker compose up -d --build
```

- Endpoint: `GET /render?url=<url>`
- Optional: `proxy`—proxy URL for the request (works with your Squid or an external proxy).

### Remote desktop (optional)

```bash
cd opt/remote
docker compose up -d --build
```

User credentials are set with build args `USERNAME` and `PSWD` in `docker-compose.yml`. Port **3389** is RDP.

## How the pieces fit together

1. **Squid** handles outbound HTTP(S) from your apps with username/password auth.
2. **Scrapers** load pages in headless Chromium and return rendered HTML. The Crawlee build can use the network **through a proxy** via a query parameter.
3. **Remote desktop** is a separate use case: full GUI and tools in one container (handy for debugging or manual work behind a proxy).

## Security

- Keep the proxy password only in `opt/proxy/.env` (template: `.env.example`); for the API Bearer token, replace hardcoded credentials before exposing anything to the public internet.
- Do not expose proxy and RDP ports to the internet without a firewall and strong passwords.

## License and ownership

Internal/service repository; add a license file separately if you need one.
