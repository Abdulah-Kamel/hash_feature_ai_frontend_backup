"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Lock, ArrowLeft } from "lucide-react";

export default function StageDetail({
  title = "القسم الأول",
  stages = [],
  onBack,
  onLearn,
  onOpenStage,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-full h-10 px-4 bg-card"
          >
            العودة
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
      </div>

      <Card className="rounded-2xl p-5 bg-gradient-to-b from-[#262626] to-[#262626cc] text-white">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              const first = stages[0];
              if (first && first.status === "opened") onLearn?.(first);
            }}
            disabled={!stages[0] || stages[0]?.status !== "opened"}
            className="rounded-lg h-10 px-4"
          >
            أكمل التعلم
          </Button>
          <div className="ml-auto text-right">
            <p className="text-base font-medium">المرحلة الأولى</p>
            <p className="text-sm font-light">
              عدد الأسئلة:
              {Array.isArray(stages?.[0]?.stageMcq)
                ? stages[0].stageMcq.length
                : 0}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {Array.isArray(stages) &&
          stages.map((st, i) => {
            const n = i + 1;
            const isDone = st?.status === "completed";
            const isOpened = st?.status === "opened";
            const state = isDone ? "done" : isOpened ? "current" : "locked";
            const total = Array.isArray(st.stageMcq) ? st.stageMcq.length : 0;
            return (
              <div
                key={st._id || n}
                className="space-y-2 flex items-center justify-between gap-2"
              >
                {n % 2 !== 0 && (
                  <div
                    className={`h-[2px] w-24 bg-border ${
                      state === "done"
                        ? "bg-emerald-600/50"
                        : state === "current"
                        ? "bg-primary"
                        : "bg-card"
                    }`}
                  />
                )}
                <Card
                  onClick={() => {
                    if (isOpened) onOpenStage?.(st);
                  }}
                  aria-disabled={!isOpened}
                  className={
                    "rounded-full px-4 py-3 flex flex-row items-center justify-between overflow-hidden flex-1 " +
                    (isDone
                      ? "bg-emerald-600/10 text-white border border-emerald-600/50"
                      : isOpened
                      ? "cursor-pointer bg-primary/20 text-primary-foreground"
                      : "opacity-70 bg-card text-foreground")
                  }
                >
                  <div className="flex items-center gap-2 bg-foreground/10 px-2 py-2 rounded-full">
                    {isDone ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : isOpened ? (
                      <ArrowLeft className="size-5" />
                    ) : (
                      <Lock className="size-5" />
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm">المرحلة {st.stageNumber}</p>
                    <p className="text-xs opacity-80">عدد الأسئلة: {total}</p>
                  </div>
                  <div className="size-8 grid place-items-center rounded-full bg-white/10">
                    <span className="text-sm">{n}</span>
                  </div>
                </Card>
                {n % 2 === 0 && (
                  <div
                    className={`h-[2px] w-24 bg-border ${
                      state === "done"
                        ? "bg-emerald-600/50"
                        : state === "current"
                        ? "bg-primary"
                        : "bg-card"
                    }`}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
