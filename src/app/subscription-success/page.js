"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(10);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!sessionId) {
      router.push("/dashboard/settings/billing");
      return;
    }

    // Countdown to auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard/settings/billing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, router]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
      
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/stars-bg.png')] bg-cover bg-center opacity-60 mix-blend-screen animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <Card className="max-w-2xl w-full p-8 text-center space-y-6 bg-card/50 backdrop-blur-sm border-primary/20 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-4 ring-4 ring-green-500/20 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">تم الدفع بنجاح!</h1>
          <p className="text-muted-foreground text-lg">
            شكراً لاشتراكك في الباقة الاحترافية. تم تفعيل حسابك بنجاح.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          رقم العملية: <br />
          <span className="font-mono text-xs select-all">{sessionId}</span>
        </div>

        <div className="space-y-4 pt-4">
          <Button asChild className="w-full text-lg h-12" size="lg">
            <Link href="/dashboard/overview">
              العودة للوحة التحكم
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground animate-pulse">
            سيتم تحويلك تلقائياً خلال {countdown} ثواني...
          </p>
        </div>
      </Card>
    </div>
  );
}
