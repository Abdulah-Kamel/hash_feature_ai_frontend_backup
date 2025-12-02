"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Lightbulb, X, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import StageFlashcardsResult from "@/components/chat/StageFlashcardsResult";

export default function StageFlashcards({
  title = "الدرس الأول",
  total = 18,
  index = 1,
  onBack,
  items,
  setId,
}) {
  const cards = useMemo(() => {
    const base = Array.isArray(items) && items.length ? items : null;
    return Array.from({ length: total }, (_, i) => ({
      ...base[i % base.length],
      id: i + 1,
    }));
  }, [items, total]);
  const [current, setCurrent] = useState(index);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const startAtRef = useRef(0);
  const [finishedAt, setFinishedAt] = useState(null);
  const [durationMs, setDurationMs] = useState(0);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    startAtRef.current = Date.now();
  }, []);
  const progress = Math.round(
    (Math.min(current, cards.length) / cards.length) * 100
  );

  const goPrev = () => {
    setFlipped(false);
    setCurrent((c) => {
      const prev = Math.max(1, c - 1);
      setShowHint(false);
      return prev;
    });
  };
  const goNext = () => {
    setFlipped(false);
    setCurrent((c) => {
      const next = c + 1;
      if (next > cards.length) {
        const now = Date.now();
        setFinishedAt(now);
        setDurationMs(Math.max(0, now - (startAtRef.current || 0)));
      }
      setShowHint(false);
      return next;
    });
  };
  const markCorrect = () => {
    setCorrectCount((v) => v + 1);
    try {
      if (setId && cards[current - 1]?.q) {
        fetch(`/api/ai/flashcards?id=${encodeURIComponent(setId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: cards[current - 1].q }),
        });
      }
    } catch {}
    goNext();
  };
  const markWrong = () => {
    setWrongCount((v) => v + 1);
    try {
      if (setId && cards[current - 1]?.q) {
        fetch(`/api/ai/flashcards?id=${encodeURIComponent(setId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: cards[current - 1].q }),
        });
      }
    } catch {}
    goNext();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goNext();
      else if (e.key === "ArrowRight") goPrev();
      else if (e.key === " ") setFlipped((f) => !f);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (current > cards.length) {
    return (
      <StageFlashcardsResult
        title={title}
        total={cards.length}
        correct={correctCount}
        wrong={wrongCount}
        durationMs={durationMs}
        onBack={onBack}
        onRestart={() => {
          setCorrectCount(0);
          setWrongCount(0);
          setFlipped(false);
          setCurrent(1);
          startAtRef.current = Date.now();
          setFinishedAt(null);
          setDurationMs(0);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-white">{title}</p>
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full h-10 px-4 bg-card"
        >
          العودة
          <ArrowRight className="size-5 ml-2" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-end">
          <span className="border rounded-full bg-primary px-3 py-1 text-white text-sm">
            {current} / {cards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="relative h-[454px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 rounded-2xl bg-card shadow-sm pointer-events-none"
            style={{
              top: 30 + i * 20,
              width: "92%",
              height: 420 - i * 10,
              opacity: 0.9 - i * 0.25,
            }}
          />
        ))}
        <Card
          onClick={() => setFlipped((f) => !f)}
          className="absolute py-0 px-4 border-0 shadow-none inset-0 rounded-2xl bg-linear-to-b from-primary/80 to-primary text-white flex items-center justify-center cursor-pointer"
        >
          {!flipped ? (
            <div className="text-center space-y-4">
              <p className="text-2xl">{cards[current - 1].q}</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-2xl">{cards[current - 1].a}</p>
            </div>
          )}
          <div className="mx-auto mt-4 w-fit border border-white rounded-full px-4 py-1">
            اضغط لقلب الكارت
          </div>
          {showHint && (
            <div className="absolute bottom-6 left-6">
              <div className="flex items-start justify-between bg-white text-[#303030] rounded-2xl px-3 py-2 w-[280px] shadow-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(false);
                  }}
                  className="mt-1 h-6 w-6 grid place-items-center rounded-full cursor-pointer"
                >
                  <X className="size-4" />
                </button>
                <p className="text-sm text-right">{cards[current - 1].hint}</p>
              </div>
            </div>
          )}
          {cards[current - 1]?.hint && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHint(true);
              }}
              className="absolute bottom-6 left-6 h-8 w-8 grid place-items-center rounded-full bg-white/20 border border-white/50 cursor-pointer"
              aria-label="إظهار التلميح"
            >
              <Lightbulb className="size-5 text-white" />
            </button>
          )}
        </Card>
      </div>
      <div className="flex items-center justify-center mt-10 gap-4">
        <Button
          onClick={markWrong}
          variant="outline"
          className="rounded-xl py-6 cursor-pointer px-6 border-red-500 text-red-500"
        >
          <X className="size-5 mr-2" />
          أجبتها خطا
        </Button>
        <Button
          onClick={markCorrect}
          variant="outline"
          className="rounded-xl py-6 cursor-pointer px-6 border-emerald-600 text-emerald-600"
        >
          <Check className="size-5 mr-2" />
          أجبتها صح
        </Button>
      </div>
      <div className="flex items-center justify-between mt-1">
        <Button
          onClick={goNext}
          variant="outline"
          className="rounded-xl py-6 cursor-pointer px-6 border-primary text-primary"
        >
          <ArrowRight className="size-5 mr-2" />
          التالي
        </Button>
        <Button
          onClick={goPrev}
          variant="outline"
          className="rounded-xl py-6 cursor-pointer px-6"
        >
          السابق
          <ArrowRight className="size-5 mr-2" />
        </Button>
      </div>
    </div>
  );
}
