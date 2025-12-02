import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const c = await cookies();
  const authToken = c.get("authToken");
  const refreshToken = c.get("refreshToken");
  let user = null;
  try {
    const raw = c.get("user")?.value;
    if (raw) user = JSON.parse(raw);
  } catch {}
  return NextResponse.json({ isAuthenticated: !!authToken, hasRefreshToken: !!refreshToken, user });
}
