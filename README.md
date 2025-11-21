# TinyLink


1 — Project summary (one line)

Build a small URL shortener (like bit.ly) with: create short links (optional custom code), redirect /:code (302), click counting + last-clicked time, delete link, dashboard list, single-link stats page, and a /healthz endpoint. Follow the exact routes and API contract in the spec. 

Take-Home Assignment_ TinyLink …

2 — Tech choices (recommended)

Backend: Node.js + Express (simple to test and host).

DB: Postgres (Neon on free tier) — stores links & click data.

Frontend: Next.js (or plain React + Vite). If time is short, Next.js gives easy deployment on Vercel.

Styling: Tailwind CSS (lightweight, fast) or plain CSS.

Hosting: Vercel (Next) or Render/Railway (Node/Express). 

Take-Home Assignment_ TinyLink …

3 — Database schema (single table recommended)

A single links table is sufficient.

SQL (Postgres):

CREATE TABLE links (
  code VARCHAR(8) PRIMARY KEY,        -- short code (unique)
  target_url TEXT NOT NULL,           -- the long URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP WITH TIME ZONE,
  deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_links_target ON links (target_url);


Notes:

code must match [A-Za-z0-9]{6,8} per spec.

Use deleted flag OR actually delete row on DELETE — either works; if using flag, ensure redirect checks deleted = false. 

Take-Home Assignment_ TinyLink …


4 — API design (must follow these paths exactly)

Implement these endpoints (JSON responses):

POST /api/links — Create link

Request JSON: { "target": "https://example.com", "code": "abc123" } (code optional)

Validations: target is valid URL (http/https), code if present matches [A-Za-z0-9]{6,8}.

Responses:

201 created: { "code": "abc123", "target": "...", "clicks": 0, "created_at": "..." }

409 if code exists: { "error": "Code already exists" }

400 for invalid input.

GET /api/links — List all links

Response: 200 with list: [{ "code": "...", "target": "...", "clicks": N, "last_clicked": "..." }, ...]

GET /api/links/:code — Stats for one code

200 with single object or 404 if not found.

DELETE /api/links/:code — Delete link

204 on success or 404 if not found.

GET /healthz — Health check

200 with { "ok": true, "version": "1.0" }. (Can include DB connectivity/uptime)

GET /:code — Redirect

If exists & not deleted: HTTP 302 redirect to target, increment clicks atomically and update last_clicked.

If not exists: return 404 page.

Make sure headers, status codes and route names match exactly for autograder. 

Take-Home Assignment_ TinyLink …

5 — Backend implementation details & tips

URL validation: Use a robust validator (e.g., Node new URL() inside try/catch) and require http/https.

Unique code handling:

If client supplies code: check DB uniqueness → 409 on conflict.

If not provided: generate random [A-Za-z0-9]{6} (or 6–8) and retry on collision.

Atomic click increment: Use UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code = $1 and read target_url in same transaction if possible to avoid race conditions.

404 after delete: If you use soft delete, ensure redirect and GET /api/links/:code treat deleted = true as not found.

6 — Frontend pages & components

Pages (must exist per spec):

/ Dashboard (list, add form, delete action)

Table columns: Short code (link to /code/:code), Target URL (truncate with ellipsis + copy button), Total clicks, Last clicked, Actions (Delete).

Add form: Target URL input + optional custom code input (validate inline). Disable submit while request pending. Show inline errors & success toast.

States: loading, empty, error.

/code/:code Stats page

Show full info for code: target, created_at, clicks, last_clicked, QR or copy link button (optional).

/:code Redirect — no UI required, performs 302.

/healthz — JSON endpoint.

Component breakdown:

LinkTable, LinkRow, CreateLinkForm, SearchBar (optional), Toast for feedback, Header/Footer.

UX details (per spec):

Truncate long URLs with CSS ellipsis and provide full URL in tooltip or copy button.

Inline validation messages (e.g., "Invalid URL", "Code already exists").

Responsive layout: single-column on narrow screens.

7 — .env.example

Provide required env variables:

DATABASE_URL=postgres://username:password@host:5432/dbname
PORT=3000
BASE_URL=https://your-deployment-url.com   # used to show full short links
NODE_ENV=production


8 — Autograding checklist (implement & test these)

Map your tests to the spec:

/healthz returns 200 and JSON { ok: true }. ✔️

POST /api/links creates a link; duplicate code returns 409 (test by creating same code twice). ✔️

GET /:code redirects (302) and increments click count (check clicks increment after redirect). ✔️

DELETE /api/links/:code prevents redirect afterwards (should return 404). ✔️

UI: Form validation, table, stats page, responsiveness. ✔️

I recommend writing a small script or curl commands to demonstrate these for your video walk-through.

9 — Example curl flows (quick smoke tests)

Create:

curl -X POST -H "Content-Type: application/json" \
  -d '{"target":"https://example.com","code":"test123"}' \
  https://your-app.com/api/links


Redirect:

curl -I https://your-app.com/test123
# should show HTTP/1.1 302 Found and Location header


Get stats:

curl https://your-app.com/api/links/test123


Delete:

curl -X DELETE https://your-app.com/api/links/test123

10 — Deployment steps (short)

Setup DB: create Neon Postgres project; get DATABASE_URL.

Deploy backend (or Next app) to Vercel/Render/Railway. Set env vars in platform dashboard (use .env.example as guide).

Test health endpoint on deployed URL.

Add base URL to app configuration so dashboard shows full short link (e.g., ${BASE_URL}/${code}).

11 — What to include in submission (per spec)

Public URL for the deployed app (dashboard). 

Take-Home Assignment_ TinyLink …

GitHub repo URL with clear commits and README (how to run locally, env vars, DB migrations).

Walkthrough video: short (3–6 min) — show creating a link, redirect working, stats page, delete, and health endpoint.

LLM transcript if you used ChatGPT (export and include). 

Take-Home Assignment_ TinyLink …

12 — Nice-to-have extras (extra credit)

Sorting and filtering on the dashboard table.

Export CSV of links.

Rate limit create endpoint to avoid abuse.

Short analytics: referrer, user agent breakdown (requires additional table for click events).

Proper tests: unit tests for code generation/validation and integration tests for API flows.

13 — Minimal timeline to aim for (practical plan)

Day 1: Backend + DB + API endpoints + unit tests + health endpoint.

Day 2: Frontend dashboard + stats page + styling + deploy + record walkthrough.
(If short on time, prioritize backend + autograder routes + a minimal dashboard.) 

Take-Home Assignment_ TinyLink …

14 — Final quick checklist before submission

 /healthz returns 200 and JSON.

 POST /api/links (409 on duplicate).

 GET /:code does 302 and increments clicks.

 DELETE /api/links/:code breaks redirect (404).

 UI: add link, list, delete, stats page working and responsive.

 README explains running locally, env vars, DB migration, and deployment link.

 Video walkthrough link and LLM transcript included.