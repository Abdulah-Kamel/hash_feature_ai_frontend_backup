import { useEffect, useState, useCallback } from "react";
import StageDetail from "./StageDetail";
import StageCard from "./StageCard";
import StageLearn from "./StageLearn";
import SkeletonCard from "./SkeletonCard";
import { Spinner } from "@/components/ui/spinner";
import { useFileStore } from "@/store/fileStore";
import { useAiContentStore } from "@/store/aiContentStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TestView from "@/components/chat/TestView";

export default function StageSwitcher({ shouldLoad = false }) {
  const router = useRouter();
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [mcqData, setMcqData] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const folderId = useFileStore((s) => s.folderId);
  
  // Use store for stages data and loading states
  const stages = useAiContentStore((s) => s.stages);
  const loading = useAiContentStore((s) => s.stagesLoading);
  const isGenerating = useAiContentStore((s) => s.stagesGenerating);
  const setStages = useAiContentStore((s) => s.setStages);
  const setLoading = useAiContentStore((s) => s.setStagesLoading);
  const load = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ai/stages?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب المراحل", {
          position: "top-right",
          duration: 3000,
        });
        setItems([]);
        if (res?.status) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          console.error(res.status);
        }
      } else {
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        const normalized = arr.map((s) => ({
          id: s.id || s._id,
          title: s.title || "مرحلة",
          stagesCount: Array.isArray(s.stages)
            ? s.stages.length
            : s.stats?.totalStages ?? 0,
          progress: s.averageScore ?? 0,
          data: s,
        }));
        setStages(normalized);
      }
    } catch {
      setStages([]);
    }
    setLoading(false);
    setHasLoaded(true);
  }, [folderId, router]);

  useEffect(() => {
    const fn = () => load();
    window.addEventListener("stages:refresh", fn);
    return () => {
      window.removeEventListener("stages:refresh", fn);
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

  if (mode === "detail") {
    return (
      <StageDetail
        onBack={() => setMode("list")}
        onLearn={(st) => {
          if (st) setSelectedStage(st);
          setMode("learn");
        }}
        onOpenStage={(st) => {
          setSelectedStage(st);
          setMode("learn");
        }}
        title={selected?.title || "القسم الأول"}
        stages={selected?.data?.stages || []}
      />
    );
  }
  if (mode === "learn") {
    return (
      <StageLearn
        onBack={() => setMode("detail")}
        title={`${selected?.title || "القسم"} - المرحلة ${
          selectedStage?.stageNumber || 1
        }`}
        content={selectedStage?.stageContent || ""}
        mcqs={
          Array.isArray(selectedStage?.stageMcq) ? selectedStage.stageMcq : []
        }
        onOpenMcq={() => {
          const arr = Array.isArray(selectedStage?.stageMcq)
            ? selectedStage.stageMcq
            : [];
          const mapped = arr.map((m) => {
            const opts = Array.isArray(m.options) ? m.options : [];
            const correctIdx = Math.max(
              0,
              opts.findIndex((o) => o === m.answer)
            );
            return {
              q: m.question,
              options: opts,
              correct: correctIdx < 0 ? 0 : correctIdx,
            };
          });
          setMcqData(mapped);
          setMode("mcq");
        }}
      />
    );
  }
  if (mode === "mcq") {
    return (
      <TestView
        onBack={() => setMode("learn")}
        title={`${selected?.title || "القسم"} - اختبار المرحلة ${
          selectedStage?.stageNumber || 1
        }`}
        total={Array.isArray(mcqData) ? mcqData.length : 0}
        index={1}
        data={mcqData}
        onFinish={async ({ score }) => {
          const id = selected?.data?._id || selected?.data?.id || selected?.id;
          if (!id) return;
          try {
            const res = await fetch(
              `/api/ai/stages?id=${encodeURIComponent(id)}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  stageNumber: selectedStage?.stageNumber || 1,
                  score: score ?? 0,
                }),
              }
            );
            if (res && res.ok) {
              window.dispatchEvent(new Event("stages:refresh"));
              // Navigate back to stage detail view after finishing
              setMode("detail");
            }
          } catch {}
        }}
      />
    );
  }
  return (
    <div className="space-y-4">
      {(loading || isGenerating) && (
        <>
          <SkeletonCard className="bg-gradient-to-b from-primary/80 to-primary" />
          <SkeletonCard className="bg-gradient-to-b from-primary/80 to-primary" />
        </>
      )}
      {!loading && !isGenerating && stages.length === 0 && (
        <div className="text-sm text-muted-foreground">لا توجد مراحل</div>
      )}
      {!loading && !isGenerating &&
        stages.map((it) => (
          <StageCard
            key={it.id}
            title={it.title}
            stagesCount={it.stagesCount}
            progress={it.progress}
            onOpen={() => {
              setSelected(it);
              setMode("detail");
            }}
          />
        ))}
    </div>
  );
}
