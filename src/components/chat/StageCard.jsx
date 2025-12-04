"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { ArrowLeft, GitMerge, Share2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StageCard({ title, stagesCount = 5, progress = 89, onOpen, className, variant = "primary" }) {
  // Define color classes based on variant
  const colorClasses = {
    primary: "bg-linear-to-b from-primary/80 to-primary",
    secondary: "bg-linear-to-b from-secondary/80 to-secondary",
    green: "bg-linear-to-b from-[#278F5C]/80 to-[#278F5C]",
  };

  const bgClass = colorClasses[variant] || colorClasses.primary;

  return (
    <Card className={`rounded-2xl p-6 ${bgClass} text-white space-y-5 ${className || ""}`} dir="rtl">
      <div className="flex items-center justify-between">
        <div className="size-9 grid place-items-center rounded-full border border-white">
          <GitMerge className="size-5 text-white" />
        </div>
        <div className="flex-1 text-right ms-2">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm font-light">عدد المراحل: {stagesCount}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpen} className="size-9 grid place-items-center rounded-full bg-white/25 cursor-pointer">
            <ArrowLeft className="size-5 text-white" />
          </button>
        </div>
      
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-1 bg-white/40 [&_[data-slot=progress-indicator]]:bg-white" />
        <div className="flex items-center justify-between text-sm">
          <span>التقدم</span>
          <span>{progress}%</span>
        </div>
      </div>
    </Card>
  );
}