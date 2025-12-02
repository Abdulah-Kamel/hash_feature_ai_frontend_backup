"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  LayoutGrid,
  Plus,
  ShoppingBag,
  Folder,
  ChevronDown,
  Settings,
  LogOut,
  ChevronUp,
  FileText,
} from "lucide-react";
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
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import logo from "@/assets/logo.svg";
import ChatSidebar from "@/components/chat/ChatSidebar";
import useAuth from "@/hooks/use-auth";
import UploadDialogTrigger from "@/components/upload/UploadDialog";
import { useFileStore } from "@/store/fileStore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

const Index = ({ variant = "global" }) => {
  const { user } = useAuth();
  const files = useFileStore((s) => s.files);
  const router = useRouter();
  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };
  if (variant === "chat") {
    return <ChatSidebar />;
  }
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
        {/* Navigation Links */}
        <SidebarGroup className="w-full">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/subscribe">
                    <Zap className="size-4" />
                    <span>اشترك الآن</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive className="py-5">
                  <Link href="/dashboard/overview">
                    <LayoutGrid className="size-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <UploadDialogTrigger
                  onUploaded={(fid) => {
                    if (fid)
                      router.push(
                        `/dashboard/folders/${encodeURIComponent(fid)}`
                      );
                  }}
                >
                  <SidebarMenuButton className="py-5 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Plus className="size-4" />
                      <span>ملف جديد</span>
                    </div>
                  </SidebarMenuButton>
                </UploadDialogTrigger>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="py-5">
                  <Link href="/marketplace">
                    <ShoppingBag className="size-4" />
                    <span>السوق</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Files Section */}
        <SidebarGroup className="w-full">
          <SidebarGroupLabel>الملفات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive className="py-5">
                  <Link href="/files" className="justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="size-4" />
                      <span>كل الملفات</span>
                    </div>
                    <ChevronDown className="size-4" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {Array.isArray(files) && files.length > 0 ? (
                files.map((f) => (
                  <SidebarMenuItem key={f.id || f._id || f.name}>
                    <SidebarMenuButton className="py-4 justify-start">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4" />
                        <span className="truncate max-w-[160px]">{f.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton className="py-4 justify-start">
                    <span className="text-sm text-muted-foreground">
                      لا توجد ملفات
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
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
};

export default Index;
