// One-off: copy users from MongoDB into Supabase Auth, keeping their bcrypt
// password hashes so existing passwords keep working.
//
// Usage (from backend-youssef/backend-youssef):
//   MONGODB_URI=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-users-to-supabase.js
// Run the SQL migration in /supabase/migrations first so profiles get created.
import "dotenv/config";
import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";

const { MONGODB_URI, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("MONGODB_URI, SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

await mongoose.connect(MONGODB_URI);
const users = await mongoose.connection.db.collection("users").find().toArray();
console.log(`Found ${users.length} users in MongoDB`);

let migrated = 0;
let failed = 0;
for (const user of users) {
  const { error } = await supabase.auth.admin.createUser({
    email: user.email,
    password_hash: user.password,
    email_confirm: true,
    user_metadata: { name: user.name ?? "" },
  });
  if (error) {
    failed++;
    console.error(`  ✗ ${user.email}: ${error.message}`);
  } else {
    migrated++;
    console.log(`  ✓ ${user.email}`);
  }
}

console.log(`Done: ${migrated} migrated, ${failed} failed`);
await mongoose.disconnect();
