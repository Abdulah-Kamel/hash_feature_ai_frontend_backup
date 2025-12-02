import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

export async function POST(req) {
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
  let body = {};
  try {
    body = await req.json();
  } catch {}
  const res = await fetch(`${base}/api/v1/ai/stages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, {
      status: res.status,
    });
  return NextResponse.json(final);
}

export async function GET(req) {
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
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");
  const url = folderId
    ? `${base}/api/v1/ai/stages?folderId=${encodeURIComponent(folderId)}`
    : `${base}/api/v1/ai/stages`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, {
      status: res.status,
    });
  return NextResponse.json(final);
}

export async function PATCH(req) {
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
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  let body = {};
  try {
    body = await req.json();
  } catch {}
  if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
  const res = await fetch(
    `${base}/api/v1/ai/stages/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body || {}),
    }
  );
  let final = null;
  try {
    final = await res.json();
  } catch {}
  if (!res.ok)
    return NextResponse.json(final || { message: res.statusText }, {
      status: res.status,
    });
  return NextResponse.json(final);
}
