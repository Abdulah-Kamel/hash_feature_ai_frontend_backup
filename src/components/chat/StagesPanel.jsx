"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import StageSwitcher from "./ٍStageSwitvher"; // Note: Keeping original filename typo for now to avoid breaking import
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

export default function StagesPanel() {
  const [genBusy, setGenBusy] = React.useState(false);
  const [stageOpen, setStageOpen] = React.useState(false);
  const [stageTitle, setStageTitle] = React.useState("");
  
  const folderId = useFileStore((s) => s.folderId);
  const getSelectedIds = useFileStore((s) => s.getSelectedIds);
  const setStagesGenerating = useAiContentStore((s) => s.setStagesGenerating);

  const handleGenerateStages = async () => {
    if (genBusy) return;
    const ids = getSelectedIds();
    if (!(folderId && ids.length)) {
      toast.error("اختر الملفات ومساحة العمل أولاً", {
        position: "top-right",
        duration: 2500,
      });
      return;
    }
    
    const title = stageTitle?.trim() || "مرحلة جديدة";
    setStageOpen(false);
    setStageTitle("");
    
    setGenBusy(true);
    setStagesGenerating(true);
    const payload = { title, folderId, fileIds: ids };
    
    try {
      const res = await fetch(`/api/ai/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || "فشل إنشاء المراحل", {
          position: "top-right",
          duration: 3000,
        });
      } else {
        toast.success("تم إنشاء المراحل بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        try {
          window.dispatchEvent(new Event("stages:refresh"));
        } catch {}
      }
    } catch {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-right",
        duration: 3000,
      });
    }
    setGenBusy(false);
    setStagesGenerating(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        <Button
          onClick={() => setStageOpen(true)}
          disabled={genBusy}
          className="w-full h-14 rounded-lg bg-primary/20 text-primary-foreground justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {genBusy ? (
            <Spinner className="size-5" />
          ) : (
            <PlusCircle className="size-6" />
          )}
          إنشاء مراحل
        </Button>
        <div className="">
          <StageSwitcher shouldLoad={true} />
        </div>
      </div>

      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 w-[867px] max-w-[92vw]">
          <DialogClose asChild>
            <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card cursor-pointer">
              <X className="size-4" />
            </button>
          </DialogClose>
          <DialogHeader className="justify-center">
            <DialogTitle className="text-xl font-semibold text-muted-foreground">
              عنوان المراحل
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">أدخل العنوان</p>
              <Input
                value={stageTitle}
                onChange={(e) => setStageTitle(e.target.value)}
                className="h-12 rounded-xl bg-card border-[#515355]"
              />
            </div>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                onClick={handleGenerateStages}
                disabled={genBusy}
              >
                {genBusy ? <Spinner className="size-5" /> : null}
                إنشاء
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setStageOpen(false)}
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
