"use client";
import { create } from "zustand";

export const useFileStore = create((set, get) => ({
  folderId: null,
  files: [],
  selectedIds: new Set(),
  isUploading: false,
  setFolderId: (id) => set({ folderId: id }),
  setFiles: (files) => set({ files }),
  setIsUploading: (v) => set({ isUploading: v }),
  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  clearSelection: () => set({ selectedIds: new Set() }),
  getSelectedIds: () => Array.from(get().selectedIds),
}));
