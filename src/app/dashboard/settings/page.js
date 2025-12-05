"use client";
import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PrivacyDetails from "@/components/settings/PrivacyDetails";
import SocialAccountsCard from "@/components/settings/SocialAccountsCard";
import LanguageCard from "@/components/settings/LanguageCard";
import PrivacyCard from "@/components/settings/PrivacyCard";
import DeleteAccountCard from "@/components/settings/DeleteAccountCard";
import ProfileDetails from "@/components/settings/ProfileDetails";
import PasswordCard from "@/components/settings/PasswordCard";
import LogoutCard from "@/components/settings/LogoutCard";
import BillingPlans from "@/components/settings/BillingPlans";
import FaqAccordion from "@/components/settings/FaqAccordion";
import UsageCard from "@/components/settings/UsageCard";

export default function SettingsPage() {
  const [tab, setTab] = React.useState("settings");
  const [lang, setLang] = React.useState("ar");
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({
    name: "محمود عمر",
    position: "طالب",
    country: "مصر",
    specialization: "إدارة أعمال",
    university: "جامعة الملك فهد",
    email: "",
    phone: "",
    plan: "free",
    uploadsToday: 0,
    aiTokensToday: 0,
    weeklyTriesUsed: 0,
    totalTries: 0,
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  });
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profiles", { credentials: "include" });
        const json = await res.json();
        if (!active) return;
        const d = json?.data || {};
        setProfile((p) => ({
          ...p,
          name: d.name || p.name,
          email: d.email || p.email,
          phone: d.phone || p.phone,
          plan: d.plan || p.plan,
          uploadsToday:
            typeof d.uploadsToday === "number"
              ? d.uploadsToday
              : p.uploadsToday,
          aiTokensToday:
            typeof d.aiTokensToday === "number"
              ? d.aiTokensToday
              : p.aiTokensToday,
          weeklyTriesUsed:
            typeof d.weeklyTriesUsed === "number"
              ? d.weeklyTriesUsed
              : p.weeklyTriesUsed,
          totalTries:
            typeof d.totalTries === "number" ? d.totalTries : p.totalTries,
          country: p.country,
          specialization: p.specialization,
          university: p.university,
        }));
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);
  const [privacy, setPrivacy] = React.useState("public");
  const languages = [
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ];

  return (
    <SidebarInset className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="space-y-6" dir="rtl">
        <TabsContent value="settings" className="space-y-6">
          <SocialAccountsCard />
          <LanguageCard value={lang} onChange={setLang} languages={languages} />
          <PrivacyCard onOpen={() => setPrivacyOpen(true)} />
          <PrivacyDetails open={privacyOpen} onOpenChange={setPrivacyOpen} />
          <DeleteAccountCard />
        </TabsContent>

        <TabsContent value="profile" dir="rtl" className="space-y-6">
          <Card className="rounded-xl p-4 space-y-2 bg-background border-none gap-4">
            <p className="text-2xl font-semibold text-white">تفاصيل الملف</p>
            <p className="text-sm text-muted-foreground">
              إدارة تفاصيل الملف الخاصة بك
            </p>
          </Card>

          <ProfileDetails profile={profile} setProfile={setProfile} />

          <PasswordCard profile={profile} setProfile={setProfile} />

          <LogoutCard />
        </TabsContent>
        <TabsContent value="billing" dir="rtl" className="space-y-8">
          <div className="space-y-2 mb-0">
            <p className="text-2xl font-semibold text-white">الإشتراك</p>
            <p className="text-sm text-muted-foreground">
              إدارة اشتراكك وفاتورتك
            </p>
          </div>

          <Card className="p-4 space-y-6 bg-background border-0 border-b-2 border-gray-50/50 rounded-none">
            <div className="text-center space-y-3">
              <p className="text-3xl font-bold text-white">قم بترقية خطتك</p>
              <p className="text-lg text-white">
                هل أنت جاد بشأن التعلم المُعزز بالذكاء الاصطناعي؟ جرّب باقة
                مدفوعة وادرس بكفاءة أكبر بعشر مرات.
              </p>
              <p className="text-sm text-white/90">
                وفّر ساعات من إعداد البطاقات التعليمية والملاحظات وأسئلة
                الامتحانات يوميًا مع هاش بلس.
              </p>
            </div>

            <BillingPlans />
          </Card>

          <FaqAccordion />
        </TabsContent>
        <TabsContent value="usage" dir="rtl" className="space-y-6">
          <UsageCard profile={profile} />
        </TabsContent>
      </Tabs>
    </SidebarInset>
  );
}
