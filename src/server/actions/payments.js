"use server";

import { cookies } from "next/headers";

function apiBase() {
  return process.env.baseApi;
}

/**
 * Create a checkout session for the Pro plan
 */
export async function createProPlanCheckoutSession() {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/payments/pro-plan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.status === 401) {
      return { success: false, error: "Unauthorized", shouldRedirect: true };
    }
    
    if (!response.ok) {
      return { success: false, error: data.message || "Failed to create checkout session" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Payment error:", error);
    return { success: false, error: "حدث خطأ في الاتصال بالخادم" };
  }
}
