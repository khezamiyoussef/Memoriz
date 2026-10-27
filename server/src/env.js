import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Imported first by index.js: imports are evaluated before the importing
// module's body, so loading .env there would be too late for other modules.
// server/.env, regardless of the folder the command is run from
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

for (const name of ["SUPABASE_URL", "SUPABASE_ANON_KEY"]) {
  if (!process.env[name]) throw new Error(`${name} must be set (see server/.env.example)`);
}
