// Run: npm run seed:landing-page-seeder-default
// Inserts missing defaults only. Rerunning never overwrites admin edits.
import { seedLanding } from "../src/seed/defaults";
import { db } from "../src/lib/database";
seedLanding()
  .then(() =>
    console.log("Landing defaults are ready; existing content was preserved."),
  )
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
