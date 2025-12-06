import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, SaudiRiyal } from "lucide-react";

const PricingSection = () => {
  return (
    <div id="pricing" className="w-full mt-24 scroll-mt-24">
      <div className="flex flex-col items-center justify-center gap-6 mb-12 text-center">
        <h3 className="text-4xl md:text-5xl font-bold text-white">
          هل أنت جاد بشأن التعلم المعزز بالذكاء الاصطناعي؟ جرب باقة مدفوعة وادرس
          بكفاءة أكبر بعشر مرات.
        </h3>
        <p className="text-lg md:text-xl text-white/80 max-w-4xl leading-relaxed">
          وفر ساعات من إعداد البطاقات التعليمية والملاحظات وأسئلة الامتحانات
          يدويًا يوميًا مع هاش بلس. عزّز فهمك مع مُعلّم الذكاء الاصطناعي
          المُخصّص لك.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8 w-full max-w-7xl mx-auto relative">
        <div className="absolute inset-0 -z-10 h-full w-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/stars-bg.png')] bg-cover bg-center opacity-60 mix-blend-screen animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50"></div>
        </div>
        <Card className="bg-card border border-border/50 py-4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              الخطة المجانية
            </CardTitle>
            <CardDescription className="text-white/80 mt-2! text-base">
              طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
            </CardDescription>
            <p className="text-3xl font-bold text-primary mt-4">مجاناً</p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الوصول المحدود إلى الرسائل
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الوصول المحدود إلى الملاحظات واختبارات التدريب ووضع التعلم
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الحد الأقصى لحجم الملف: 50 ميجابايت
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">حتى 50 صفحة/PDF</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-transparent text-base cursor-pointer py-6 rounded-2xl text-white hover:bg-white/10"
            >
              ابدأ الآن
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-card border border-primary py-4 flex flex-col relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">المحترف</CardTitle>
              <div className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                الأكثر شهرة
              </div>
            </div>
            <CardDescription className="text-white/80 mt-2! text-base">
              طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
            </CardDescription>
            <p className="text-3xl font-bold text-white mt-4 flex items-center gap-2">
              59 <SaudiRiyal className="size-9 text-white/90" />
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الوصول المحدود إلى الرسائل
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الوصول المحدود إلى الملاحظات واختبارات التدريب ووضع التعلم
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الحد الأقصى لحجم الملف: 50 ميجابايت
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">حتى 50 صفحة/PDF</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full text-base cursor-pointer py-6 rounded-2xl"
            >
              اشترك الآن
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-card border border-border/50 py-4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl text-white">شركة</CardTitle>
            <CardDescription className="text-white/80 mt-2! text-base">
              طريقة رائعة لتجربة قوة الدراسة المعززة بالذكاء الاصطناعي.
            </CardDescription>
            <p className="text-3xl font-bold text-white mt-4 flex items-center gap-2">
              90 <SaudiRiyal className="size-9 text-white/90" />
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الوصول المحدود إلى الرسائل
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الوصول المحدود إلى الملاحظات واختبارات التدريب ووضع التعلم
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">
                  الحد الأقصى لحجم الملف: 50 ميجابايت
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white/90" />
                <span className="text-white/90">حتى 50 صفحة/PDF</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-transparent text-base cursor-pointer py-6 rounded-2xl text-white hover:bg-white/10"
            >
              ابدأ الآن
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingSection;
