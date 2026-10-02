import { adminPage } from "@/lib/auth";
import { db } from "@/lib/database";
import { Dashboard } from "@/components/admin/dashboard";
export default async function Page() {
  await adminPage();
  const [suppliers, catalog, translations, documents] = await Promise.all([
    db().supplier.count(),
    db().catalogItem.count(),
    db().contentText.count(),
    db().upload.count(),
  ]);
  return <Dashboard counts={{ suppliers, catalog, translations, documents }} />;
}
