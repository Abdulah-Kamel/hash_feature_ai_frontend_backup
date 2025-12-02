"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

export default function SkeletonCard({ className }) {
  return (
    <Card className={`rounded-2xl p-6 bg-gradient-to-b from-card to-card/80 space-y-5 animate-pulse ${className || ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 text-right me-2 space-y-2">
          <div className="h-5 w-32 bg-white/10 rounded ml-auto" />
          <div className="h-4 w-24 bg-white/10 rounded ml-auto" />
        </div>
        <div className="size-9 rounded-full border border-white/20" />
      </div>

      <div className="space-y-2">
        <div className="h-1 w-full bg-white/10 rounded" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-12 bg-white/10 rounded" />
          <div className="h-4 w-16 bg-white/10 rounded" />
        </div>
      </div>
    </Card>
  );
}
