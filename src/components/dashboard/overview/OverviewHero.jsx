"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FileText } from "lucide-react";
import UploadDialogTrigger from "@/components/upload/UploadDialog";
import WorkspaceDialogTrigger from "@/components/workspace/WorkspaceDialog";
import { createFolder } from "@/server/actions/folders";
import { toast } from "sonner";
import useAuth from "@/hooks/use-auth";

export default function OverviewHero() {
  const { user } = useAuth();
  const userName = user?.name || "";
  const initials = userName?.trim()?.charAt(0) || "م";
  const userEmail = user?.email || "";
  const userPhone = user?.phone ? String(user.phone) : "";
  return (
    <div className="bg-gradient-to-l from-primary to-secondary rounded-xl p-6 md:p-8 flex xl:flex-row flex-col justify-between items-center gap-6">
      <div className="flex-1">
        <h2 className="font-semibold text-2xl xl:text-3xl text-white">
          أهلا بك يا {userName || ""}!
        </h2>
        <div className="flex items-center gap-3 mt-4">
          <Avatar className="size-12 bg-white">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-white text-primary text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-start">
            <p className="text-base font-medium text-white/90">
              {userName || ""}
            </p>
            {userEmail && <p className="text-sm text-white/80">{userEmail}</p>}
          </div>
        </div>
      </div>
      <div className="flex 2xl:flex-row flex-col items-center gap-4">
        <UploadDialogTrigger>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-transparent shadow-lg px-6 py-8 xl:px-8 text-white cursor-pointer hover:shadow-2xl border-white/30"
          >
            <FileText className="size-6" />
            <div className="text-start">
              <span className="text-base font-semibold">ملف جديد</span>
              <p className="text-sm">إنشاء ملف جديد من خلال ملف PDF</p>
            </div>
          </Button>
        </UploadDialogTrigger>
        <WorkspaceDialogTrigger
          onSave={async (name) => {
            const result = await createFolder({ name });
            if (result?.success) {
              toast.success("تم إنشاء المجلد بنجاح", {
                position: "top-right",
                duration: 3000,
                classNames: "toast-success mt-14",
              });
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("folders:refresh"));
              }
            } else {
              toast.error(result?.error || "فشل إنشاء المجلد", {
                position: "top-right",
                duration: 3000,
                classNames: "toast-error mt-14",
              });
            }
          }}
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-transparent shadow-lg px-6 py-8 xl:px-8 text-white cursor-pointer hover:shadow-2xl border-white/30"
          >
            <FileText className="size-6" />
            <div className="text-start">
              <span className="text-base font-semibold">مجلد جديد</span>
              <p className="text-sm">إنشاء مجلد جديد يحتوي على ملفات</p>
            </div>
          </Button>
        </WorkspaceDialogTrigger>
      </div>
    </div>
  );
}
