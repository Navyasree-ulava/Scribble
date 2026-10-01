# Deploying Scribble

Monorepo layout that matters for deployment:

| Path              | Role                     | Deploys to |
| ----------------- | ------------------------ | ---------- |
| `apps/frontend`   | Next.js canvas UI        | Vercel     |
| `apps/http-backend` | Express REST API (auth, rooms) | Railway service 1 |
| `apps/ws-backend` | WebSocket server (live drawing sync) | Railway service 2 |
| `packages/db`     | Prisma schema + client   | shared     |
| `apps/web`        | Legacy text-chat prototype — not deployed | — |

The frontend needs **both** backends. The HTTP API handles auth and room
metadata; the WebSocket server carries the live drawing events.

---

## Prerequisites

- Node 20+ and pnpm 9+ (locally)
- A GitHub account (the repo is already pushed to `Navyasree-ulava/Scribble`)
- A Vercel account
- A Railway account
- A Postgres database — you already have Neon; grab the connection string

---

## Step 1 — Deploy the HTTP backend to Railway

Railway reads `railway.json` from the **repo root**, so the two config files
provided here need to be swapped in per service. Do this in the GitHub UI or
locally, then push.

1. Go to [railway.app/new](https://railway.app/new) → **Deploy from GitHub repo**
   → select `Navyasree-ulava/Scribble`.
2. Railway will try to detect the monorepo. Click **Configure** and set:
   - **Root Directory**: `/` (leave empty — this is the monorepo root)
   - **Build Command**:
     ```
     pnpm install --frozen-lockfile && pnpm turbo run build --filter=@repo/common --filter=@repo/config --filter=@repo/db --filter=http-backend
     ```
   - **Start Command**:
     ```
     node apps/http-backend/dist/index.js
     ```
3. Open the **Variables** tab and add:

   | Variable       | Value |
   | -------------- | ----- |
   | `JWT_SECRET`   | a long random string (see below) |
   | `DATABASE_URL` | your Neon connection string |
   | `CORS_ORIGIN`  | leave empty for now, add your Vercel URL in Step 3 |
   | `NODE_ENV`     | `production` |

   Generate a secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   > **Use a brand new value, not the one in your local `.env`.** A signed JWT
   > was committed to git in `apps/web/app/config.ts` and still verifies against
   > the current `JWT_SECRET`. It has no expiry claim, so it stays valid
   > indefinitely. The file has been fixed, but the token remains in git
   > history — rotating the secret is what actually invalidates it. Because the
   > secret is shared, rotating it invalidates every existing session (users
   > just log in again).

4. Deploy. When it finishes, Railway gives you a URL like
   `https://scribble-http.up.railway.app`.
5. Verify: open `https://scribble-http.up.railway.app/health` — you should see
   the text `OK`.

> **Copy that URL.** You need it as `NEXT_PUBLIC_HTTP_BACKEND` later.

---

## Step 2 — Deploy the WebSocket backend to Railway

Same repo, **second service**. In Railway: **New Project → Deploy from GitHub
→ same repo → New Service**.

Set:

- **Root Directory**: `/`
- **Build Command**:
  ```
  pnpm install --frozen-lockfile && pnpm turbo run build --filter=@repo/common --filter=@repo/config --filter=@repo/db --filter=ws-backend
  ```
- **Start Command**:
  ```
  node apps/ws-backend/dist/index.js
  ```

Variables — `JWT_SECRET` and `DATABASE_URL` again, with the **exact same
values** as the HTTP service. The token is signed by one and verified by the
other, so a mismatch breaks WebSocket auth silently.

After deploying you get e.g. `https://scribble-ws.up.railway.app`.
The browser connects over **wss://** to that same host.

> WebSockets need a connection that stays open. On Railway's free tier this
> works, but the service may sleep and connections will drop; Railway resumes on
> the next request. Keep the tab open to hold the connection.

---

## Step 3 — Deploy the frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import `Navyasree-ulava/Scribble`.
2. On the configure screen, **set the Root Directory to `apps/frontend`**.
   This is the important part — the app lives in a subfolder of a monorepo.
3. Framework should be detected as **Next.js**. Build command `pnpm build`,
   install command `pnpm install`.
4. Add environment variables:

   | Variable | Value |
   | -------- | ----- |
   | `NEXT_PUBLIC_HTTP_BACKEND` | `https://scribble-http.up.railway.app` (from Step 1) |
   | `NEXT_PUBLIC_WS_BACKEND`   | `wss://scribble-ws.up.railway.app` (from Step 2) |

   Note the `wss://` scheme, not `ws://` — browsers require TLS in production.
5. Deploy. You get a URL like `https://scribble-xyz.vercel.app`.

---

## Step 4 — Close the CORS loop

Now go back to the **HTTP backend** service on Railway and set:

```
CORS_ORIGIN=https://scribble-xyz.vercel.app
```

Redeploy (or restart) the service. Requests from any other origin are now
rejected, so if you see CORS errors in the browser console, this value is the
first thing to check.

---

## Step 5 — Apply database migrations

The Prisma schema lives at `packages/db/prisma/schema.prisma`. If this is a
fresh database, push the migrations from your machine:

```bash
pnpm exec prisma migrate deploy --schema packages/db/prisma/schema.prisma
```

This uses the `DATABASE_URL` from your local `.env`.

---

## Verifying the deployment

1. Open the Vercel URL, sign up, and log in.
2. Create a room on the dashboard.
3. Open the room in a second browser (or an incognito window) and draw — shapes
   should appear in both windows in real time.

If drawing does not sync, check in order:
- DevTools → Network → the WebSocket frame is open (`101 Switching Protocols`)
- `JWT_SECRET` matches on both Railway services
- `NEXT_PUBLIC_WS_BACKEND` uses `wss://` and points at the ws service, not the http one

---

## Environment variable reference

### Backend (`packages/config/env.ts`)
| Variable | Used by | Notes |
| -------- | ------- | ----- |
| `JWT_SECRET` | both | Required in production. App refuses to boot without it. |
| `PORT` | both | Injected automatically by Railway. Falls back to 3001 / 8080. |
| `DATABASE_URL` | both | Postgres connection string. |
| `CORS_ORIGIN` | http | Comma-separated allowlist of browser origins. |

### Frontend (`apps/frontend/config.ts`)
| Variable | Default | Notes |
| -------- | ------- | ----- |
| `NEXT_PUBLIC_HTTP_BACKEND` | `http://localhost:3001` | REST base URL. |
| `NEXT_PUBLIC_WS_BACKEND`   | `ws://localhost:8080`    | WebSocket base URL. |

Both are read at build time (`NEXT_PUBLIC_*`), so changing them on Vercel
requires a redeploy, not just a restart.
