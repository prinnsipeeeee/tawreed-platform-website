// Run: npm run seed:admin-account
// Set ADMIN_EMAIL and ADMIN_PASSWORD in .env; existing passwords are preserved.
import { seedAdmin } from "../src/seed/admin";
import { db } from "../src/lib/database";
seedAdmin()
  .then(() =>
    console.log("Admin account is ready. Existing passwords are unchanged."),
  )
  .catch(() => {
    console.error(
      "Admin seed failed. Check the database and ADMIN_EMAIL / ADMIN_PASSWORD (12+ characters, at most 72 UTF-8 bytes).",
    );
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
