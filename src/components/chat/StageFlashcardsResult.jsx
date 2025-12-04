"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Timer, Check, X } from "lucide-react";
import Image from "next/image";
import cuteOctopus from "@/assets/cute-octopus.svg";
export default function StageFlashcardsResult({ title, total, correct, wrong, durationMs, onBack, onRestart }) {
  const minutes = Math.max(1, Math.round(durationMs / 60000));
  const percent = Math.round(((correct || 0) / (total || 1)) * 100);
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="rounded-full py-5 px-4 bg-card cursor-pointer">
          <ArrowRight className="size-5 mr-1" />
          العودة
        </Button>
        <p className="text-xl font-semibold text-white">{title}</p>
      </div>

      <Card className="rounded-2xl bg-gradient-to-b from-primary/80 to-primary text-white p-8">
        <div className="flex flex-col items-center gap-4">
          <Image src={cuteOctopus} alt="checkmark" width={100} height={100} />
          <p className="text-3xl font-bold">!مبروك</p>
          <p className="text-xl">لقد أنهيت الكروت</p>
          <div className="relative size-36">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: `conic-gradient(#fff ${percent * 3.6}deg, rgba(255,255,255,.25) 0deg)` }}
            />
            <div className="absolute inset-2 rounded-full bg-primary grid place-items-center">
              <div className="text-center">
                <p className="text-sm opacity-90">النتيجة</p>
                <p className="text-lg font-semibold">{correct}/{total}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl bg-card p-4 flex flex-row items-center gap-1" dir="rtl">
          <Timer className="size-5" />
          <p className="text-sm">وقت الإجابة: {minutes} دقيقة</p>
        </Card>
        <Card className="rounded-xl bg-card p-4 flex flex-row items-center gap-1" dir="rtl">
          <Timer className="size-5" />
          <p className="text-sm">إجمالي الكروت: {total}</p>
        </Card>
        <Card className="rounded-xl bg-card p-4 flex flex-row items-center gap-1" dir="rtl">
          <X className="size-5 text-red-500" />
          <p className="text-sm">الكروت الخاطئة: {wrong}</p>
        </Card>
        <Card className="rounded-xl bg-card p-4 flex flex-row items-center gap-1" dir="rtl">
          <Check className="size-5 text-emerald-600" />
          <p className="text-sm">الكروت الصحيحة: {correct}</p>
        </Card>
      </div>

      <div className="space-y-3">
        <Button onClick={onRestart} className="w-full h-14 rounded-full bg-primary text-primary-foreground cursor-pointer">إعادة الكروت</Button>
        <Button onClick={onBack} variant="outline" className="w-full h-14 rounded-full cursor-pointer">العودة</Button>
      </div>
    </div>
  );
}