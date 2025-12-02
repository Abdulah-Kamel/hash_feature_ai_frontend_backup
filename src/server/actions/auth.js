"use server";
import { cookies } from "next/headers";

export async function handleRegister(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Signup failed" };
  return { success: true, data: final };
}

export async function handleLogin(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Login failed" };
  const c = await cookies();
  const token = final?.token || final?.accessToken;
  const refreshToken = final?.refreshToken;
  const user = final?.data || final?.user || null;
  if (token)
    c.set("authToken", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  if (refreshToken) c.set("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict", path: "/" });
  if (user)
    c.set("user", JSON.stringify(user), {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });
  return { success: true, data: final };
}

export async function handleForgotPassword(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Forgot password failed" };
  return { success: true, data: final };
}

export async function handleVerifyOtp(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/verify-otp`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "OTP verification failed" };
  return { success: true, data: final };
}

export async function handleResetPassword(data) {
  const res = await fetch(`${process.env.baseApi}/api/v1/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  const final = await res.json();
  if (!res.ok) return { success: false, error: final?.message || "Reset password failed" };
  return { success: true, data: final };
}

export async function handleVerifyResetCode(data) {
  const res = await fetch(
    `${process.env.baseApi}/api/v1/auth/verify-reset-code`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }
  );
  const final = await res.json();
  if (!res.ok)
    return {
      success: false,
      error: final?.message || "Verify reset code failed",
    };
  return { success: true, data: final };
}
