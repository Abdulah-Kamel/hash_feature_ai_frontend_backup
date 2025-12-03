"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function FolderNav({ folderId }) {
  const pathname = usePathname();
  
  const tabs = [
    { label: "المراحل", value: "stages", href: `/dashboard/folders/${folderId}/stages` },
    { label: "كروت الفلاش", value: "flashcards", href: `/dashboard/folders/${folderId}/flashcards` },
    { label: "الاختبارات", value: "tests", href: `/dashboard/folders/${folderId}/tests` },
  ];

  return (
    <div className="bg-card p-2 rounded-lg w-full grid grid-cols-3 gap-2 mb-4">
      {tabs.map((t) => {
        const isActive = pathname?.includes(t.value);
        return (
          <Link
            key={t.value}
            href={t.href}
            className={cn(
              "rounded-lg px-6 py-3 text-sm flex-1 text-center transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground font-medium" 
                : "bg-background hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
