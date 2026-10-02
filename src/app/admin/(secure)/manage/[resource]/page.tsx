import { adminPage } from "@/lib/auth";
import { notFound } from "next/navigation";
import { resources } from "@/lib/resources";
import { listResource } from "@/lib/content";
import { ResourceEditor } from "@/components/admin/resource-editor";
export default async function Page({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  await adminPage();
  const { resource } = await params;
  if (!resources[resource]) notFound();
  return (
    <ResourceEditor
      key={resource}
      name={resource}
      initialRows={await listResource(resource)}
    />
  );
}
