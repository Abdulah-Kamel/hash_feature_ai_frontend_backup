"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import TestView from "./TestView";
import StageCard from "./StageCard";
import SkeletonCard from "./SkeletonCard";
import { useFileStore } from "@/store/fileStore";
import { useAiContentStore } from "@/store/aiContentStore";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function TestsPanel() {
  const [testsMode, setTestsMode] = React.useState("list");
  const [genBusy, setGenBusy] = React.useState(false);
  const [mcqOpen, setMcqOpen] = React.useState(false);
  const [mcqTitle, setMcqTitle] = React.useState("");
  const [mcqView, setMcqView] = React.useState(null);
  const [mcqLoaded, setMcqLoaded] = React.useState(false);
  
  const folderId = useFileStore((s) => s.folderId);
  const getSelectedIds = useFileStore((s) => s.getSelectedIds);
  
  const mcqs = useAiContentStore((s) => s.mcqs);
  const mcqsLoading = useAiContentStore((s) => s.mcqsLoading);
  const setMcqs = useAiContentStore((s) => s.setMcqs);
  const setMcqsLoading = useAiContentStore((s) => s.setMcqsLoading);
  const setMcqsGenerating = useAiContentStore((s) => s.setMcqsGenerating);

  const handleGenerateMcq = async () => {
    if (genBusy) return;
    const ids = getSelectedIds();
    if (!(folderId && ids.length)) {
      toast.error("اختر الملفات ومساحة العمل أولاً", {
        position: "top-right",
        duration: 2500,
      });
      return;
    }
    
    const title = mcqTitle?.trim() || "اختبار جديد";
    setMcqOpen(false);
    setMcqTitle("");
    
    setGenBusy(true);
    setMcqsGenerating(true);
    const payload = { title, folderId, fileIds: ids };
    
    try {
      const res = await fetch(`/api/ai/mcq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "فشل إنشاء الاختبار", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("تم إنشاء الاختبار بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        try {
          window.dispatchEvent(new Event("mcq:refresh"));
        } catch {}
      }
    } catch {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }
    setGenBusy(false);
    setMcqsGenerating(false);
  };

  const loadMcq = React.useCallback(async () => {
    if (!folderId) return;
    setMcqsLoading(true);
    try {
      const res = await fetch(
        `/api/ai/mcq?folderId=${encodeURIComponent(folderId)}`
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "تعذر جلب الاختبارات", {
          position: "top-right",
          duration: 3000,
        });
        setMcqs([]);
      } else {
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
          : [];
        setMcqs(arr);
      }
    } catch {
      setMcqs([]);
    }
    setMcqsLoading(false);
  }, [folderId, setMcqs, setMcqsLoading]);

  React.useEffect(() => {
    const fn = () => loadMcq();
    window.addEventListener("mcq:refresh", fn);
    return () => {
      window.removeEventListener("mcq:refresh", fn);
    };
  }, [loadMcq]);

  // Load MCQ on mount if folderId exists
  React.useEffect(() => {
    if (!mcqLoaded && folderId) {
      loadMcq();
      setMcqLoaded(true);
    }
  }, [mcqLoaded, folderId, loadMcq]);

  // Reset loaded state when folder changes
  React.useEffect(() => {
    setMcqLoaded(false);
  }, [folderId]);

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {testsMode === "view" && mcqView ? (
          <TestView
            onBack={() => setTestsMode("list")}
            title={mcqView.title}
            total={mcqView.data.length}
            index={1}
            data={mcqView.data}
            onFinish={async ({ score }) => {
              const id = mcqView.id;
              if (!id) return;
              try {
                const res = await fetch(
                  `/api/ai/mcq?id=${encodeURIComponent(id)}`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ score: score ?? 0 }),
                  }
                );
                if (res && res.ok) {
                  window.dispatchEvent(new Event("mcq:refresh"));
                }
              } catch {}
            }}
          />
        ) : (
          <>
            <Button
              onClick={() => setMcqOpen(true)}
              className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="size-6" />
              إنشاء اختبارات
            </Button>
            <div className="mt-4 space-y-4">
              {mcqsLoading && (
                <>
                  <SkeletonCard className="bg-gradient-to-b from-secondary/80 to-secondary" />
                  <SkeletonCard className="bg-gradient-to-b from-secondary/80 to-secondary" />
                </>
              )}
              {!mcqsLoading && mcqs.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  لا توجد اختبارات
                </div>
              )}
              {!mcqsLoading &&
                mcqs.map((it) => {
                  const title = it?.title || "اختبار";
                  const total = Array.isArray(it?.mcq)
                    ? it.mcq.length
                    : it?.stats?.totalQuestions ?? 0;
                  const progress = 0;
                  const mapped = Array.isArray(it?.mcq)
                    ? it.mcq.map((q) => ({
                        q: q.question,
                        options: q.options || [],
                        correct: Math.max(
                          0,
                          (q.options || []).findIndex((o) => o === q.answer)
                        ),
                        score: typeof q.score === "number" ? q.score : 10,
                      }))
                    : [];
                  return (
                    <StageCard
                      key={it.id || it._id}
                      title={title}
                      stagesCount={total}
                      progress={progress}
                      className="bg-secondary"
                      onOpen={() => {
                        setMcqView({
                          id: it.id || it._id,
                          title,
                          data: mapped,
                        });
                        setTestsMode("view");
                      }}
                    />
                  );
                })}
            </div>
          </>
        )}
      </div>

      <Dialog open={mcqOpen} onOpenChange={setMcqOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
          <DialogClose asChild>
            <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
              <X className="size-4" />
            </button>
          </DialogClose>
          <DialogHeader className="justify-center">
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              عنوان الاختبار
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">أدخل العنوان</p>
              <Input
                value={mcqTitle}
                onChange={(e) => setMcqTitle(e.target.value)}
                className="h-12 rounded-xl bg-card border-[#515355]"
              />
            </div>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                onClick={handleGenerateMcq}
                disabled={genBusy}
              >
                {genBusy ? <Spinner className="size-5" /> : null}
                إنشاء
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setMcqOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
