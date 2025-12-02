"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Settings,
  Zap,
  Plus,
  Trash2,
  LogOut,
  ChevronUp,
} from "lucide-react";
import UploadDialogTrigger from "@/components/upload/UploadDialog";
import { useFileStore } from "@/store/fileStore";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteFile } from "@/server/actions/files";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function SidebarSection({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground/80">{title}</p>
      {children}
    </div>
  );
}

function SourceItem({ label, checked, onToggle, onDelete }) {
  return (
    <div className="w-full flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2 hover:bg-card/80 group">
      <button
        onClick={onToggle}
        className="flex items-center justify-start gap-2 text-sm flex-1 min-w-0 cursor-pointer"
      >
        <Checkbox
          checked={checked}
          readOnly
          className="data-[state=checked]:bg-primary border-white shrink-0"
        />
        <span className="truncate">{label}</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export default function ChatSidebar() {
  const files = useFileStore((s) => s.files);
  const selectedIds = useFileStore((s) => s.selectedIds);
  const toggleSelect = useFileStore((s) => s.toggleSelect);
  const isUploading = useFileStore((s) => s.isUploading);
  console.log(selectedIds);

  const sources = React.useMemo(() => {
    return files.map((f) => ({
      id: f.id,
      label: f.name,
      checked: selectedIds.has ? selectedIds.has(f.id) : false,
    }));
  }, [files, selectedIds]);

  const onToggleSource = (i) => {
    const id = sources[i]?.id;
    if (id) toggleSelect(id);
  };

  const handleDelete = async (fileId) => {
    const folderId = useFileStore.getState().folderId;
    if (!folderId || !fileId) return;

    const toastId = toast.loading("جارٍ حذف الملف...");
    try {
      const res = await deleteFile(folderId, fileId);
      if (res?.success) {
        toast.success("تم حذف الملف بنجاح", { id: toastId });
        try {
          window.dispatchEvent(new Event("files:refresh"));
        } catch {}
      } else {
        toast.error(res?.error || "فشل حذف الملف", { id: toastId });
      }
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
    }
  };

  const { user } = useAuth();
  const router = useRouter();
  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };
  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const initials = userName?.trim()?.charAt(0) || "م";
  return (
    <Sidebar aria-label="الشريط الجانبي العام">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="Hash Plus Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-sidebar-foreground">
            هاش بلس
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup title="الرئيسية">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="py-5">
                <Link href="/dashboard/overview">
                  <Home className="size-4" />
                  <span>الرئيسية</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup title="المصادر">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-foreground/80">اختر المصادر</p>
            <UploadDialogTrigger>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 px-2 text-xs gap-1 cursor-pointer hover:bg-secondary/80"
              >
                <span>إضافة</span>
                <Plus className="size-3" />
              </Button>
            </UploadDialogTrigger>
          </div>
          <div className="space-y-4 mt-4">
            {sources.map((s, i) => (
              <SourceItem
                key={s.id}
                label={s.label}
                checked={s.checked}
                onToggle={() => onToggleSource(i)}
                onDelete={() => handleDelete(s.id)}
              />
            ))}
            {isUploading && (
              <div className="w-full flex items-center justify-start gap-2 rounded-xl bg-card px-3 py-2">
                <Skeleton className="size-4 rounded-sm" />
                <Skeleton className="h-4 w-24" />
              </div>
            )}
            {!isUploading && sources.length === 0 && (
              <div className="text-sm text-muted-foreground">لا توجد مصادر</div>
            )}
          </div>
        </SidebarGroup>

        <SidebarSeparator />
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* Free Plan Button */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Zap className="size-4" />
          <span>خطة مجانية</span>
        </Button>

        {/* User Profile */}
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
              <Avatar className="size-10 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {userName || "—"}
                </span>
                <span className="text-xs text-sidebar-foreground/70 truncate">
                  {userEmail || "—"}
                </span>
              </div>
              <ChevronUp className="size-4 text-sidebar-foreground/70" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/settings/settings"
                className="cursor-pointer"
              >
                <Settings className="size-4 ml-2" />
                الإعدادات
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="size-4 ml-2" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
