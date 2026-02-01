import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), "../../.env") });

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
