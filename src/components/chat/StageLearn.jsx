"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function StageLearn({
  title = "القسم الأول - المرحلة الأولى: الذكاء الاصطناعي",
  content = "",
  mcqs = [],
  onBack,
  onOpenMcq,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full p-4 bg-card cursor-pointer"
        >
          <ArrowRight className="size-5 ml-2" />
          العودة
        </Button>
        <h1 className="text-xl text-end md:text-2xl font-semibold text-white flex-1">
          {title}
        </h1>
      </div>
      <div className="h-px bg-[#515355]" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white text-right">
          محتوى المرحلة
        </h2>
        <Button
          onClick={onOpenMcq}
          className="rounded-lg h-10 px-4 cursor-pointer"
        >
          ابدأ اختبار المرحلة
        </Button>
      </div>

      <div className="space-y-10">
        <section className="space-y-4 text-right">
          <h3 className="text-xl font-semibold text-white">مقدمة</h3>
          <div className="space-y-4">
            <p className="text-white/90 leading-7 whitespace-pre-line">
              {content || ""}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
