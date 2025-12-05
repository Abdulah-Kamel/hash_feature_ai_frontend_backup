"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, SaudiRiyal, Check } from "lucide-react";

function Feature({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-3 rounded-full bg-green-500" />
      <p className="text-sm text-white/90">{children}</p>
    </div>
  );
}

import { createProPlanCheckoutSession } from "@/server/actions/payments";
import { toast } from "sonner";

export default function BillingPlans({ currentPlan = "free" }) {
  const [period, setPeriod] = React.useState("month");
  const [loading, setLoading] = React.useState(false);
  const price = period === "month" ? 59 : period === "quarter" ? 149 : 499;
  const options = [
    { v: "month", label: "شهر" },
    { v: "quarter", label: "3 شهور" },
    { v: "year", label: "سنة" },
  ];
  
  const isFreePlan = currentPlan === "free";
  const isProPlan = currentPlan === "pro" || currentPlan === "premium";

  const handleSubscribe = async () => {
    setLoading(true);
    const toastId = toast.loading("جاري تحويلك لصفحة الدفع...");
    
    try {
      const res = await createProPlanCheckoutSession();
      if (res.success && res.data?.session_url) {
        window.location.href = res.data.session_url;
      } else {
        toast.error(res.error || "حدث خطأ أثناء إنشاء جلسة الدفع", { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع", { id: toastId });
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 max-w-[770px] mx-auto py-4">
      <div className="mx-auto border border-[#383839] rounded-[15px] bg-[#30303080] p-1 grid grid-cols-3 text-white">
        {options.map((opt) => (
          <Button
            key={opt.v}
            variant={period === opt.v ? "default" : "ghost"}
            className="rounded-[15px] h-[32px]"
            onClick={() => setPeriod(opt.v)}
          > 
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Free Plan */}
        <Card className={`rounded-[20px] p-4  text-white gap-3 ${
          isFreePlan ? 'border-primary bg-[#303030] ' : 'border-[#515355] bg-[#303030]'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">الخطة المجانية</p>
            </div>
            {isFreePlan && (
              <Badge className="bg-primary text-white border-0 gap-1.5">
                <Check className="size-3.5" />
                الخطة الحالية
              </Badge>
            )}
          </div>
          <p className="text-sm text-white/80 mt-2">
            طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
          </p>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">مجاناً</p>
          </div>
          <div className="mt-4 space-y-3">
            <Feature>الوصول المحدود إلى الرسائل</Feature>
            <Feature>
              الوصول إلى الملاحظات واختبارات التدريب ووضع التعلم
            </Feature>
            <Feature>الحد الأقصى لحجم الملف: 50 ميجابايت</Feature>
            <Feature>حتى 50 صفحة/PDF</Feature>
          </div>
          <Button
            variant={isFreePlan ? "secondary" : "outline"}
            className="mt-auto w-full rounded-lg cursor-pointer py-5"
            disabled={isFreePlan}
          >
            {isFreePlan ? "الخطة الحالية" : "ابدأ الآن"}
          </Button>
        </Card>
        
        {/* Pro Plan */}
        <Card className={`rounded-[20px] p-4 border text-white gap-3 ${
          isProPlan ? 'border-primary bg-[#303030] ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
        }`}>
          <div className="flex items-center justify-between">
            <p className="mt-3 text-xl font-semibold">المحترف</p>
            {isProPlan ? (
              <Badge className="bg-primary text-white border-0 gap-1.5">
                <Check className="size-3.5" />
                الخطة الحالية
              </Badge>
            ) : (
              <div className="inline-flex items-center gap-2 bg-primary text-white rounded-lg px-3 py-2 text-xs">
                الأكثر شهرة
                <Sparkles className="size-4" />
              </div>
            )}
          </div>
          <p className="text-sm text-white/80 mt-2">
            طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
          </p>
          <div className="text-right flex items-center gap-1">
            <p className="text-3xl font-bold">{price}</p>
            <SaudiRiyal className="size-8" />
          </div>
          <div className="mt-4 space-y-3">
            <Feature>الوصول المحدود إلى الرسائل</Feature>
            <Feature>
              الوصول إلى الملاحظات واختبارات التدريب ووضع التعلم
            </Feature>
            <Feature>الحد الأقصى لحجم الملف: 50 ميجابايت</Feature>
            <Feature>حتى 50 صفحة/PDF</Feature>
          </div>
          <Button 
            className="mt-auto w-full rounded-lg cursor-pointer py-5"
            disabled={isProPlan || loading}
            variant={isProPlan ? "secondary" : "default"}
            onClick={isProPlan ? undefined : handleSubscribe}
          >
            {loading ? "جاري التحويل..." : isProPlan ? "الخطة الحالية" : "اشترك الآن"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
