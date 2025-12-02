"use client";
import { Flame } from "lucide-react";
import Image from "next/image";
import cute_octopus from "@/assets/cute-octopus.svg";
import * as React from "react";

export default function StreakCard() {
  const [currentStreak, setCurrentStreak] = React.useState(0);
  const [longestStreak, setLongestStreak] = React.useState(0);
  const [lastActive, setLastActive] = React.useState(null);
  const [days, setDays] = React.useState([false, false, false, false, false, false, false]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/profiles', { credentials: 'include' });
        const json = await res.json();
        if (!active) return;
        const d = json?.data || {};
        const cs = Math.max(0, d.currentStreak ?? 0);
        const ls = Math.max(0, d.longestStreak ?? 0);
        setCurrentStreak(cs);
        setLongestStreak(ls);
        setLastActive(d.lastActiveDate ? new Date(d.lastActiveDate) : null);
        const today = new Date();
        const todayIdx = today.getDay(); // 0 Sunday .. 6 Saturday
        const arr = Array(7).fill(false);
        for (let i = 0; i < Math.min(cs, 7); i++) {
          const idx = (todayIdx - i + 7) % 7;
          arr[idx] = true;
        }
        setDays(arr);
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  const dayNames = ["الأحد","الأثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  return (
    <div className="bg-primary rounded-xl p-4">
      <div className="flex items-center gap-3">
        <Flame className="size-10" />
        <div className="flex-1">
          <p className="text-white text-lg font-semibold">{currentStreak} يوم</p>
          <p className="text-white/90 text-sm">ستريك التعلم، حافظ على الاستريك الخاص بك</p>
          <p className="text-white/80 text-xs">أطول مدة ستريك: {longestStreak} يوم</p>
          {lastActive && (
            <p className="text-white/70 text-xs">آخر نشاط: {lastActive.toLocaleString('ar')}</p>
          )}
        </div>
        <Image src={cute_octopus} className="size-25" alt="octopus" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        {dayNames.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-2">
            <span className={"size-6 rounded-full " + (days[i] ? "bg-white" : "bg-white/30")} />
            <span className="text-white/90 text-xs">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
