"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/dashboard/settings", label: "إعدادات" },
    { href: "/dashboard/settings/profile", label: "الملف الشخصي" },
    { href: "/dashboard/settings/billing", label: "الإشتراك" },
    { href: "/dashboard/settings/usage", label: "الإستهلاك" },
  ];
  return (
    <SidebarInset className="min-h-screen p-4" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
      </div>
      <div className="bg-card p-2 rounded-lg w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={
                active
                  ? "rounded-lg px-6 py-3 bg-primary text-primary-foreground"
                  : "rounded-lg px-6 py-3 bg-background text-white"
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-6">{children}</div>
    </SidebarInset>
  );
}
