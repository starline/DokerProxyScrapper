# Scrapper v2 (Crawlee render API)

A small HTTP service that loads a URL in headless Chromium (via [Crawlee](https://crawlee.dev/) and [Puppeteer](https://pptr.dev/)), applies [puppeteer-extra stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth), and returns the fully rendered HTML.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Run with Docker Compose

From this directory:

```bash
docker compose up -d --build
```

The API listens on **port 3000** (`NODE_ENV=production` inside the container).

## API

### `GET /render`

Renders the given page and responds with HTML.

| Query parameter | Required | Description |
|-----------------|----------|-------------|
| `url`           | Yes      | Full HTTP(S) URL to open. Must start with `http`. |
| `proxy`         | No       | Proxy URL for the browser (format supported by Crawlee’s proxy configuration). |

**Examples**

```http
GET http://localhost:3000/render?url=https://example.com
```

```http
GET http://localhost:3000/render?url=https://example.com&proxy=http://user:pass@host:port
```

**Responses**

- `200` — HTML body of the page after `body` is available (timeout 15s for the selector; handler timeout 60s).
- `400` — Missing or invalid `url`.
- `500` — Render failure.

## Project layout

- `docker-compose.yml` — builds and runs the `crawlee` image, maps `3000:3000`.
- `crawlee/` — Node app: `server.js` (Express), `render.js` (PuppeteerCrawler + stealth).

## Local development (without Docker)

From `crawlee/`:

```bash
npm install
npm start
```

You need a Chromium-compatible environment (the Docker image installs the required system libraries).
