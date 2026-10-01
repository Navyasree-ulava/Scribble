import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// In local dev the repo-root .env is loaded. On Railway/Vercel the variables
// come from the platform's own environment, so we must never overwrite them.
const localEnvCandidates = [
  path.join(process.cwd(), "../../.env"),
  path.join(process.cwd(), "../.env"),
  path.join(process.cwd(), ".env"),
];

for (const candidate of localEnvCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
  }
}

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it in your deployment platform's environment variables.`
    );
  }

  return value;
}

// In production a missing secret must fail loudly rather than silently signing
// tokens with a well-known default.
export const JWT_SECRET =
  process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? required("JWT_SECRET") : "dev-secret");

export const PORT = Number(process.env.PORT || 3001);
