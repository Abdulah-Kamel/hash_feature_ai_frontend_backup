import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

export async function GET() {
  const base = apiBase();
  if (!base)
    return NextResponse.json(
      { message: "API base URL not configured" },
      { status: 500 }
    );
  const c = await cookies();
  const token = c.get("authToken")?.value;
  if (!token)
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  const res = await fetch(`${base}/api/v1/profiles`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  let final = null;
  try { final = await res.json(); } catch {}
  if (!res.ok) return NextResponse.json(final || { message: res.statusText }, { status: res.status });
  return NextResponse.json(final);
}
