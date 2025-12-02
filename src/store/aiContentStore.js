import { create } from "zustand";

export const useAiContentStore = create((set) => ({
  // Stages state
  stages: [],
  stagesLoading: false,
  stagesGenerating: false,

  // Flashcards state
  flashcards: [],
  flashcardsLoading: false,
  flashcardsGenerating: false,

  // MCQs state
  mcqs: [],
  mcqsLoading: false,
  mcqsGenerating: false,

  // Stages actions
  setStages: (stages) => set({ stages }),
  setStagesLoading: (loading) => set({ stagesLoading: loading }),
  setStagesGenerating: (generating) => set({ stagesGenerating: generating }),

  // Flashcards actions
  setFlashcards: (flashcards) => set({ flashcards }),
  setFlashcardsLoading: (loading) => set({ flashcardsLoading: loading }),
  setFlashcardsGenerating: (generating) => set({ flashcardsGenerating: generating }),

  // MCQs actions
  setMcqs: (mcqs) => set({ mcqs }),
  setMcqsLoading: (loading) => set({ mcqsLoading: loading }),
  setMcqsGenerating: (generating) => set({ mcqsGenerating: generating }),

  // Reset all
  resetAll: () => set({
    stages: [],
    stagesLoading: false,
    stagesGenerating: false,
    flashcards: [],
    flashcardsLoading: false,
    flashcardsGenerating: false,
    mcqs: [],
    mcqsLoading: false,
    mcqsGenerating: false,
  }),
}));
