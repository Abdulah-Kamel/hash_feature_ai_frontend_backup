"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import ProfileDetails from "@/components/settings/ProfileDetails";
import PasswordCard from "@/components/settings/PasswordCard";
import LogoutCard from "@/components/settings/LogoutCard";

export default function ProfileTabPage() {
  const [profile, setProfile] = React.useState({
    name: "محمود عمر",
    position: "طالب",
    country: "مصر",
    specialization: "إدارة أعمال",
    university: "جامعة الملك فهد",
    email: "",
    phone: "",
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
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="rounded-xl p-4 space-y-2 bg-background">
        <p className="text-2xl font-semibold text-white">تفاصيل الملف</p>
        <p className="text-sm text-muted-foreground">
          إدارة تفاصيل الملف الخاصة بك
        </p>
      </Card>
      <ProfileDetails profile={profile} setProfile={setProfile} />
      <PasswordCard profile={profile} setProfile={setProfile} />
      <LogoutCard />
    </div>
  );
}
