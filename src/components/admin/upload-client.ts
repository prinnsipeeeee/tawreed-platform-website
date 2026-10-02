import { upload } from "@vercel/blob/client";
export async function uploadFile(file: File, supplierKey?: string) {
  const response = await fetch("/api/admin/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, size: file.size, supplierKey }),
  });
  const intent = await response.json();
  if (!response.ok) throw new Error(intent.error);
  try {
    if (intent.driver === "blob") {
      await upload(intent.pathname, file, {
        access: "private",
        handleUploadUrl: "/api/admin/blob",
        contentType: intent.contentType,
        clientPayload: JSON.stringify({ id: intent.id }),
      });
      const done = await fetch(`/api/admin/files/${intent.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!done.ok) throw new Error((await done.json()).error);
    } else {
      const done = await fetch(`/api/admin/files/${intent.id}`, {
        method: "POST",
        headers: { "Content-Type": intent.contentType },
        body: file,
      });
      if (!done.ok) throw new Error((await done.json()).error);
    }
    return intent.id as string;
  } catch (error) {
    await fetch("/api/admin/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: intent.id }),
    }).catch(() => {});
    throw error;
  }
}
