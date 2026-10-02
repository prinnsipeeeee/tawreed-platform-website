import { cookies } from "next/headers";
import { AdminProvider } from "@/components/admin/admin-context";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale =
    (await cookies()).get("admin_locale")?.value === "ar" ? "ar" : "en";
  return <AdminProvider initialLocale={locale}>{children}</AdminProvider>;
}
