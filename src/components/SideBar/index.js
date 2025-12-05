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
  Trash2,
  Menu,
  ChevronRight,
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
  useSidebar,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import logo from "@/assets/logo.svg";
import ChatSidebar from "@/components/chat/ChatSidebar";
import useAuth from "@/hooks/use-auth";
import { logout, fetchUserFiles, deleteFile } from "@/server/actions/files";
import { toast } from "sonner";
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
import { fixArabicFilename } from "@/lib/utils";

const Index = ({ variant = "global" }) => {
  const { user } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  const [userFiles, setUserFiles] = React.useState([]);
  const [filesLoading, setFilesLoading] = React.useState(false);
  const [filesExpanded, setFilesExpanded] = React.useState(true);
  const [deletingIds, setDeletingIds] = React.useState(new Set());
  const files = useFileStore((s) => s.files);
  const router = useRouter();
  
  // Fetch user files on mount
  React.useEffect(() => {
    const loadUserFiles = async () => {
      setFilesLoading(true);
      try {
        const res = await fetchUserFiles();
        if (res?.success) {
          const filesList = Array.isArray(res.data?.data) 
            ? res.data.data 
            : Array.isArray(res.data) 
            ? res.data 
            : [];
          setUserFiles(filesList);
        } else {
          setUserFiles([]);
        }
      } catch (error) {
        console.error('Error loading files:', error);
        setUserFiles([]);
      }
      setFilesLoading(false);
    };
    
    loadUserFiles();
    
    // Listen for files:refresh event to reload files after upload
    const handleRefresh = () => {
      console.log("files:refresh event received in SideBar, reloading user files...");
      loadUserFiles();
    };
    
    window.addEventListener("files:refresh", handleRefresh);
    
    return () => {
      window.removeEventListener("files:refresh", handleRefresh);
    };
  }, []);
  
  const handleDeleteFile = async (file) => {
    const folderId = file.folderId || file.folder?._id || file.folder;
    if (!folderId) {
      toast.error("لا يمكن حذف الملف: معرف المجلد مفقود");
      return;
    }
    
    const fileId = file._id || file.id;
    
    // Add to deleting set
    setDeletingIds(prev => new Set(prev).add(fileId));
    
    const toastId = toast.loading("جارٍ حذف الملف...");
    try {
      const res = await deleteFile(folderId, fileId);
      if (res?.success) {
        toast.success("تم حذف الملف بنجاح", { id: toastId });
        // Remove file from local state
        setUserFiles(prev => prev.filter(f => (f._id || f.id) !== fileId));
        // Remove from deleting set
        setDeletingIds(prev => {
          const next = new Set(prev);
          next.delete(fileId);
          return next;
        });
      } else {
        toast.error(res?.error || "فشل حذف الملف", { id: toastId });
        // Remove from deleting set on error
        setDeletingIds(prev => {
          const next = new Set(prev);
          next.delete(fileId);
          return next;
        });
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
      // Remove from deleting set on error
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };
  
  if (variant === "chat") {
    return <ChatSidebar />;
  }
  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const initials = userName?.trim()?.charAt(0) || "م";
  return (
    <>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className={`fixed top-4 right-4 ${open ? "z-0" : "z-50"} bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-accent cursor-pointer`}
        >
          <Menu className="size-5" />
        </Button>
      <Sidebar aria-label="الشريط الجانبي العام">
        <div className="justify-end me-3 mt-3 hidden md:flex absolute top-0 left-0">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="cursor-pointer"
          >
            {open ? (
              <ChevronRight className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
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
                    <Link href="/dashboard/settings/billing">
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
                  <SidebarMenuButton 
                    asChild={false}
                    isActive 
                    className="py-5 cursor-pointer"
                    onClick={() => setFilesExpanded(!filesExpanded)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Folder className="size-4" />
                        <span>كل الملفات</span>
                      </div>
                      <ChevronDown 
                        className={`size-4 transition-transform duration-200 ${
                          filesExpanded ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {filesExpanded && (filesLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <SidebarMenuItem key={i}>
                        <SidebarMenuButton className="py-4 justify-start">
                          <div className="flex items-center gap-2 w-full">
                            <Skeleton className="size-4 rounded" />
                            <Skeleton className="h-4 flex-1" />
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </>
                ) : Array.isArray(userFiles) && userFiles.length > 0 ? (
                  userFiles.map((f) => {
                    const fileId = f._id || f.id;
                    const isDeleting = deletingIds.has(fileId);
                    
                    return (
                      <SidebarMenuItem key={fileId || f.fileName}>
                        <SidebarMenuButton 
                          className={`py-4 justify-between group transition-all duration-300 ${
                            isDeleting ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="size-4 shrink-0" />
                            <span className="truncate">{fixArabicFilename(f.fileName || f.name)}</span>
                          </div>
                          <div 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isDeleting) {
                                handleDeleteFile(f);
                              }
                            }}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive cursor-pointer ${
                              isDeleting ? 'opacity-100 cursor-not-allowed' : ''
                            }`}
                          >
                            {isDeleting ? (
                              <div className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton className="py-4 justify-start">
                      <span className="text-sm text-muted-foreground">
                        لا توجد ملفات
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
                  href="/dashboard/settings"
                  className="cursor-pointer"
                >
                  <Settings className="size-4 ml-2" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
              <LogOut className="size-4 ml-2" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default Index;
