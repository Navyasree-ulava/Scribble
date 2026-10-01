/**
 * Backend URLs.
 *
 * Both values are public by design: the browser calls the REST API and opens
 * the WebSocket directly, so it needs these addresses. They are not secrets.
 *
 * The normalizers below make the deployment tolerant of how the value was
 * pasted into the Vercel dashboard. Without them, a value that lost its scheme
 * (e.g. "my-api.up.railway.app") or picked up a trailing slash silently
 * produces a 404, because axios then builds a relative URL against the site's
 * own origin. Failing loudly at build time is far easier to diagnose.
 */

function normalizeHttp(raw: string | undefined, fallback: string): string {
  const value = (raw ?? "").trim() || fallback;
  // Strip any trailing slashes so paths concatenate cleanly.
  const withoutTrailingSlash = value.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(withoutTrailingSlash)) {
    return `https://${withoutTrailingSlash}`;
  }
  return withoutTrailingSlash;
}

function normalizeWs(raw: string | undefined, fallback: string): string {
  const value = (raw ?? "").trim() || fallback;
  const withoutTrailingSlash = value.replace(/\/+$/, "");

  if (/^wss:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }

  if (/^ws:\/\//i.test(withoutTrailingSlash)) {
    // A browser blocks ws:// on an https:// page, so upgrade a pasted ws://
    // value. Localhost is exempt: the dev server is plain http.
    return /^wss?:\/\/localhost(:\d+)?/i.test(withoutTrailingSlash)
      ? withoutTrailingSlash
      : withoutTrailingSlash.replace(/^ws:\/\//i, "wss://");
  }

  return `wss://${withoutTrailingSlash}`;
}

export const HTTP_BACKEND = normalizeHttp(
  process.env.NEXT_PUBLIC_HTTP_BACKEND,
  "http://localhost:3001"
);

export const WS_URL = normalizeWs(
  process.env.NEXT_PUBLIC_WS_BACKEND,
  "ws://localhost:8080"
);
