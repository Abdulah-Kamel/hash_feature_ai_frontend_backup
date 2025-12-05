"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import BillingPlans from "@/components/settings/BillingPlans";
import FaqAccordion from "@/components/settings/FaqAccordion";

export default function BillingTabPage() {
  const [currentPlan, setCurrentPlan] = React.useState("free");

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profiles", { credentials: "include" });
        const json = await res.json();
        if (!active) return;
        const plan = json?.data?.plan || "free";
        setCurrentPlan(plan);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-2">
        <p className="text-2xl font-semibold text-white">الإشتراك</p>
        <p className="text-sm text-muted-foreground">إدارة اشتراكك وفاتورتك</p>
      </div>
      <Card className="p-4 space-y-6 bg-background border-0 border-b-2 border-gray-50/50 rounded-none">
        <div className="text-center space-y-3">
          <p className="text-3xl font-bold text-white">قم بترقية خطتك</p>
          <p className="text-lg text-white">هل أنت جاد بشأن التعلم المُعزز بالذكاء الاصطناعي؟ جرّب باقة مدفوعة وادرس بكفاءة أكبر بعشر مرات.</p>
          <p className="text-sm text-white/90">وفّر ساعات من إعداد البطاقات التعليمية والملاحظات وأسئلة الامتحانات يوميًا مع هاش بلس.</p>
        </div>
        <BillingPlans currentPlan={currentPlan} />
      </Card>
      <FaqAccordion />
    </div>
  );
}