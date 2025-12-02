import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const c = await cookies();
  try {
    c.delete("authToken");
    c.delete("refreshToken");
    c.delete("user");
  } catch {}
  return NextResponse.json({ success: true });
}
