// The legacy text-chat prototype. Not deployed — see DEPLOYMENT.md.
// These values are read from the environment so no credentials live in git.
export const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND || "http://localhost:3001";
export const WS_URL = process.env.NEXT_PUBLIC_WS_BACKEND || "ws://localhost:8080";
