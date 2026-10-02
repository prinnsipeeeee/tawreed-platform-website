import { adminPage } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await adminPage();
  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
