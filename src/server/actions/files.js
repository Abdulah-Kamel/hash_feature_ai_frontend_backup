"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function apiBase() {
  return process.env.baseApi;
}

export async function uploadFiles(formData) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");

  const folderId = formData.get("folderId");
  const files = formData.getAll("files");
  if (!folderId) return { success: false, error: "Missing folderId" };
  if (!files || files.length === 0)
    return { success: false, error: "No files provided" };

  const fd = new FormData();
  for (const file of files) fd.append("files", file);
  const res = await fetch(`${base}/api/v1/folders/${folderId}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}

export async function fetchFolderFiles(folderId) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");
  if (!folderId) return { success: false, error: "Missing folderId" };

  const res = await fetch(`${base}/api/v1/folders/${folderId}/files`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}

export async function deleteFile(folderId, fileId) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");
  if (!folderId || !fileId) return { success: false, error: "Missing IDs" };

  const res = await fetch(`${base}/api/v1/folders/${folderId}/files`, {
    method: "DELETE",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fileIds: [fileId] }),
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}

export async function logout() {
  const c = await cookies();
  c.delete("authToken");
  redirect("/login");
}

export async function fetchUserFiles() {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");

  const res = await fetch(`${base}/api/v1/profiles/files`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}
