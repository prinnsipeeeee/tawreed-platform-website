import { redirect } from "next/navigation";
import { adminSession } from "@/lib/auth";
import { Login } from "@/components/admin/login";
export default async function Page() {
  if (await adminSession()) redirect("/admin");
  return <Login />;
}
