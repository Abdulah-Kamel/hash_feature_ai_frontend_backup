"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
function OptionItem({ label, variant = "idle", onSelect, disabled = false }) {
  const styleMap = {
    idle: { containerBg: "#303030", containerBorder: "transparent", dotBg: "#212121", dotBorder: "#515355" },
    selected: { containerBg: "#bd6bee1a", containerBorder: "#bd6bee", dotBg: "#bd6bee", dotBorder: "transparent" },
    correct: { containerBg: "#278f5c1a", containerBorder: "#278f5c", dotBg: "#278f5c", dotBorder: "transparent" },
    wrong: { containerBg: "#ff00001a", containerBorder: "#ff0000", dotBg: "#ff0000", dotBorder: "transparent" },
  }[variant];
  return (
    <button
      onClick={disabled ? undefined : onSelect}
      className="w-full h-[75px] rounded-[15px] flex items-center justify-between px-6 cursor-pointer"
      style={{ background: styleMap.containerBg, border: `1px solid ${styleMap.containerBorder}` }}
      disabled={disabled}
    >
      <div className="flex items-center gap-3">
        <span
          className="size-5 rounded-full"
          style={{ background: styleMap.dotBg, border: `1px solid ${styleMap.dotBorder}` }}
        />
        <span className="text-white text-sm">{label}</span>
      </div>
    </button>
  );
}

export default function TestView({
  title = "الدرس الأول",
  total = 10,
  index = 1,
  data,
  onBack,
  onFinish,
}) {
  const [current, setCurrent] = React.useState(index);
  const [selected, setSelected] = React.useState(null);
  const [status, setStatus] = React.useState("idle"); // idle | selected | correct | wrong
  const [correctCount, setCorrectCount] = React.useState(0);
  const [wrongCount, setWrongCount] = React.useState(0);
  const [totalScore, setTotalScore] = React.useState(0);
  const startAtRef = React.useRef(0);
  const [finishedAt, setFinishedAt] = React.useState(null);
  const [durationMs, setDurationMs] = React.useState(0);
  React.useEffect(() => {
    startAtRef.current = Date.now();
  }, []);
  const items = React.useMemo(() => {
    const sample = [
      {
        q: "ما هو الذكاء الأصطناعي؟",
        options: [
          "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة",
          "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة",
          "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة",
          "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة",
        ],
        correct: 2,
      },
      {
        q: "اذكر تطبيقين للذكاء الاصطناعي؟",
        options: [
          "مساعدات ذكية",
          "معالجة الصور",
          "أنظمة توصية",
          "إنترنت الأشياء",
        ],
        correct: 1,
      },
    ];
    if (Array.isArray(data) && data.length) return data;
    return Array.from({ length: total }, (_, i) => sample[i % sample.length]);
  }, [data, total]);
  const maxScore = React.useMemo(() => {
    return items.reduce(
      (sum, it) => sum + (typeof it.score === "number" ? it.score : 10),
      0
    );
  }, [items]);
  const question = items[current - 1]?.q ?? "";
  const options = items[current - 1]?.options ?? [];
  const correctIndex = items[current - 1]?.correct ?? 0;
  const progressPercent = Math.round((current / total) * 100);

  const getVariant = (i) => {
    if (status === "selected") return selected === i ? "selected" : "idle";
    if (status === "correct") return i === correctIndex ? "correct" : "idle";
    if (status === "wrong")
      return i === selected ? "wrong" : i === correctIndex ? "correct" : "idle";
    return "idle";
  };

  const onSelectOption = (i) => {
    if (status === "correct" || status === "wrong") return;
    setSelected(i);
    setStatus("selected");
  };

  const onConfirm = () => {
    if (selected == null) return;
    if (selected === correctIndex) {
      setStatus("correct");
      setCorrectCount((v) => v + 1);
      const val =
        typeof items[current - 1]?.score === "number"
          ? items[current - 1].score
          : 10;
      setTotalScore((v) => v + val);
    } else {
      setStatus("wrong");
      setWrongCount((v) => v + 1);
    }
  };

  const onNext = () => {
    if (status === "idle" || status === "selected") return; // انتظار تأكيد
    setCurrent((c) => {
      const next = c + 1;
      if (next > total) {
        const now = Date.now();
        setFinishedAt(now);
        setDurationMs(Math.max(0, now - (startAtRef.current || 0)));
        if (onFinish) {
          try {
            onFinish({
              total,
              correct: correctCount,
              wrong: wrongCount,
              score: totalScore,
              maxScore,
            });
          } catch {}
        }
      }
      return next;
    });
    setSelected(null);
    setStatus("idle");
  };

  if (current > total) {
    const TestResult = require("@/components/chat/TestResult").default;
    return (
      <TestResult
        variant="secondary"
        title={title}
        total={total}
        correct={correctCount}
        wrong={wrongCount}
        durationMs={durationMs}
        onBack={onBack}
        onRestart={() => {
          setCurrent(1);
          setSelected(null);
          setStatus("idle");
          setCorrectCount(0);
          setWrongCount(0);
          startAtRef.current = Date.now();
          setFinishedAt(null);
          setDurationMs(0);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-white">{title}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-card px-4 py-3 cursor-pointer"
        >
          <span className="text-sm text-muted-foreground">العودة</span>
          <ArrowRight className="size-5" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-end">
          <span className="border rounded-full bg-primary px-3 py-1 text-white text-sm">
            {current} / {total}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <Card className="rounded-2xl w-full bg-gradient-to-b from-[#bd6beecc] to-[#bd6bee] p-6 flex items-start justify-between">
        <p className="text-white text-2xl">{question}</p>
        <div className="size-8 rounded-full bg-white/20" />
      </Card>

      <div className="space-y-3 w-full">
        {options.map((opt, i) => (
          <OptionItem
            key={i}
            label={opt}
            variant={getVariant(i)}
            onSelect={() => onSelectOption(i)}
            disabled={status === "correct" || status === "wrong"}
          />
        ))}
      </div>

      <div className="mt-6">
        {status === "correct" || status === "wrong" ? (
          <button
            onClick={onNext}
            className="w-full h-14 rounded-xl flex items-center justify-center gap-2 text-white"
            style={{
              background: status === "correct" ? "#278f5c" : "#ff0000",
            }}
          >
            <ArrowLeft className="size-5" />
            التالي
          </button>
        ) : (
          <Button
            onClick={onConfirm}
            className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/80 text-white cursor-pointer"
          >
            تأكيد
          </Button>
        )}
      </div>
    </div>
  );
}
