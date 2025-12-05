"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function apiBase() {
  return process.env.baseApi;
}

/**
 * Get the current user's profile
 */
export async function getMyProfile() {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/profiles`, {
      method: "GET",
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
      return { success: false, error: data.message || "Failed to fetch profile" };
    }

    const profileData = data.data || data;
    
    // Extract profile image URL if it exists
    if (profileData.profileImage && typeof profileData.profileImage === 'object') {
      profileData.profileImageUrl = profileData.profileImage.url;
    }

    return { success: true, data: profileData };
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, error: "An error occurred while fetching profile" };
  }
}

/**
 * Update the current user's profile
 */
export async function updateMyProfile(profileData) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/profiles`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (response.status === 401) {
      return { success: false, error: "Unauthorized", shouldRedirect: true };
    }

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to update profile" };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "An error occurred while updating profile" };
  }
}

/**
 * Get the current user's profile image URL
 */
export async function getMyProfileImage() {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/profiles/profileImage`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return { success: false, error: "Unauthorized", shouldRedirect: true };
    }

    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: null }; // No profile image
      }
      return { success: false, error: "Failed to fetch profile image" };
    }

    // Get the image as a blob and convert to base64 or URL
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return { success: true, data: imageUrl };
  } catch (error) {
    console.error("Get profile image error:", error);
    return { success: false, error: "An error occurred while fetching profile image" };
  }
}

/**
 * Upload/Update the current user's profile image
 */
export async function updateMyProfileImage(formData) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/profiles/profileImage`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData with 'profileImage' file
    });

    const data = await response.json();

    if (response.status === 401) {
      return { success: false, error: "Unauthorized", shouldRedirect: true };
    }

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to upload profile image" };
    }

    const responseData = data.data || data;
    
    // Extract profile image URL if it exists
    if (responseData.profileImage && typeof responseData.profileImage === 'object') {
      responseData.profileImageUrl = responseData.profileImage.url;
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Upload profile image error:", error);
    return { success: false, error: "An error occurred while uploading profile image" };
  }
}

/**
 * Remove the current user's profile image
 */
export async function removeMyProfileImage() {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/profiles/profileImage`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      return { success: false, error: "Unauthorized", shouldRedirect: true };
    }

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.message || "Failed to remove profile image" };
    }

    return { success: true, message: "Profile image removed successfully" };
  } catch (error) {
    console.error("Remove profile image error:", error);
    return { success: false, error: "An error occurred while removing profile image" };
  }
}

/**
 * Change the current user's password
 */
export async function changeMyPassword(passwordData) {
  const base = apiBase();
  if (!base) return { success: false, error: "API base URL not configured" };
  
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated", shouldRedirect: true };
  }

  try {
    const response = await fetch(`${base}/api/v1/profiles/change-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (response.status === 401) {
      return { success: false, error: "Unauthorized", shouldRedirect: true };
    }

    if (!response.ok) {
      return { success: false, error: data.message || "Failed to change password" };
    }

    // If a new token is returned, update it
    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("authToken", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "An error occurred while changing password" };
  }
}
