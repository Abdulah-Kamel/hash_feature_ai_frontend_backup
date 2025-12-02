import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/fileStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SkeletonCard from "./SkeletonCard";
import { useAiContentStore } from "@/store/aiContentStore";

const { default: StageCard } = require("./StageCard");
const { default: StageFlashcards } = require("./StageFlashcards");

export default function FlashcardsSwitcher({ shouldLoad = false }) {
    const router = useRouter();

  const [mode, setMode] = useState("list");
  const [view, setView] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const folderId = useFileStore((s) => s.folderId);
  
  // Use store for flashcards data and loading states
  const flashcards = useAiContentStore((s) => s.flashcards);
  const loading = useAiContentStore((s) => s.flashcardsLoading);
  const isGenerating = useAiContentStore((s) => s.flashcardsGenerating);
  const setFlashcards = useAiContentStore((s) => s.setFlashcards);
  const setLoading = useAiContentStore((s) => s.setFlashcardsLoading);

  const load = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ai/flashcards?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب كروت الفلاش", {
          position: "top-right",
          duration: 3000,
        });
        if (res?.status) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          console.error(res.status);
        }
        setItems([]);
      } else {
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        const normalized = arr.map((f) => {
          const total = Array.isArray(f.flashcards)
            ? f.flashcards.length
            : f.stats?.totalCards ?? 0;
          const answered = f.stats?.totalAnswered ?? 0;
          const progress = total > 0 ? Math.round((answered / total) * 100) : 0;
          const cards = Array.isArray(f.flashcards)
            ? f.flashcards.map((c) => ({
                q: c.question,
                a: c.answer,
                hint: c.hint,
              }))
            : [];
          return {
            id: f.id || f._id,
            title: f.title || "مجموعة كروت",
            stagesCount: total,
            progress,
            cards,
          };
        });
        setFlashcards(normalized);
      }
    } catch {
      setFlashcards([]);
    }
    setLoading(false);
    setHasLoaded(true);
  }, [folderId, router]);

  useEffect(() => {
    const fn = () => load();
    window.addEventListener("flashcards:refresh", fn);
    return () => {
      window.removeEventListener("flashcards:refresh", fn);
    };
  }, [load]);

  // Load when tab becomes active
  useEffect(() => {
    if (shouldLoad && !hasLoaded && folderId) {
      load();
    }
  }, [shouldLoad, hasLoaded, folderId, load]);

  // Reset loaded state when folder changes
  useEffect(() => {
    setHasLoaded(false);
  }, [folderId]);

  if (mode === "view" && view) {
    return (
      <StageFlashcards
        onBack={() => setMode("list")}
        title={view.title}
        total={view.items.length}
        index={1}
        items={view.items}
        setId={view.id}
      />
    );
  }
  return (
    <div className="mt-4 space-y-4">
      {(loading || isGenerating) && (
        <>
          <SkeletonCard className="bg-gradient-to-b from-primary/80 to-primary" />
          <SkeletonCard className="bg-gradient-to-b from-primary/80 to-primary" />
        </>
      )}
      {!loading && !isGenerating && flashcards.length === 0 && (
        <div className="text-sm text-muted-foreground">لا توجد كروت</div>
      )}
      {!loading && !isGenerating &&
        flashcards.map((it) => (
          <StageCard
            key={it.id}
            title={it.title}
            stagesCount={it.stagesCount}
            progress={it.progress}
            onOpen={() => {
              setView({ id: it.id, title: it.title, items: it.cards || [] });
              setMode("view");
            }}
          />
        ))}
    </div>
  );
}
