"use client";
import { create } from "zustand";

export const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  // Set the entire profile
  setProfile: (profile) => set({ profile, error: null }),

  // Update specific profile fields
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : updates,
      error: null,
    })),

  // Update profile image
  updateProfileImage: (profileImageUrl) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, profileImageUrl, profileImage: { url: profileImageUrl } }
        : null,
      error: null,
    })),

  // Remove profile image
  removeProfileImage: () =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, profileImageUrl: null, profileImage: null }
        : null,
      error: null,
    })),

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear profile (logout)
  clearProfile: () => set({ profile: null, error: null, loading: false }),

  // Get current profile
  getProfile: () => get().profile,
}));
