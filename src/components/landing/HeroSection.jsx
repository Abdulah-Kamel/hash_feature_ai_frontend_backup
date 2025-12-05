import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import LogoCarousel from "../hero/LogoCarousel";
import heroImage from "@/assets/hero-image.svg";
import skyImage from "@/assets/SkyImage.svg";
import Image from "next/image";

const HeroSection = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto text-center  z-10">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/stars-bg.png')] bg-cover bg-center opacity-60 mix-blend-screen animate-pulse"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50"></div>
        <Image src={skyImage} alt="Sky Image" className="w-full h-full" />
      </div>
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            تعلم أسرع x10 مرات مع الذكاء الاصطناعي لامتحاناتك
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            قم بتحويل أي محاضرة إلى بطاقات تعليمية واختبارات تدريبية وخرائط
            ذهنية بنقرة واحدة.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              size="xl"
              className="bg-transparent border-white text-white hover:bg-white/10 rounded-2xl px-20 py-3 text-lg font-medium cursor-pointer"
            >
              تسجيل الدخول
            </Button>
          </Link>
          <Link href="/start">
            <Button
              size="xl"
              className="bg-primary hover:bg-primary/90 border-primary< text-white rounded-2xl px-20 py-3.5 text-lg font-medium gap-2 cursor-pointer"
            >
              ابدأ الان
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
      <LogoCarousel />
      <div>
        <Image src={heroImage} alt="Hero Image" width={1000} />
      </div>
    </>
  );
};

export default HeroSection;
