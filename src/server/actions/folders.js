"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createFolder(data) {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");

  const headers = { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const res = await fetch(`${process.env.baseApi}/api/v1/folders`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  let final = null;
  try {
    final = await res.json();
    console.log(final);
  } catch (err) {
    console.log(err);
  }
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message };
  return { success: true, data: final };
}

export async function getFolders() {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");

  const headers = { "Authorization": `Bearer ${token}` };
  const res = await fetch(`${process.env.baseApi}/api/v1/folders`, { method: "GET", headers });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message };
  const data = final?.data ?? final?.folders ?? final;
  return { success: true, data };
}

export async function updateFolder(id, data) {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");

  const headers = { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const res = await fetch(`${process.env.baseApi}/api/v1/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers,
  });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message };
  return { success: true, data: final };
}

export async function deleteFolder(id) {
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token) redirect("/login");

  const headers = { "Authorization": `Bearer ${token}` };
  const res = await fetch(`${process.env.baseApi}/api/v1/folders/${id}`, { method: "DELETE", headers });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (res.status === 401) redirect("/login");
  if (!res.ok) return { success: false, error: final?.message || res.statusText };
  return { success: true, data: final };
}
