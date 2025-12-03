"use client";
import { useEffect, useState } from "react";
import { MoreHorizontal, X, Trash2 } from "lucide-react";
import {
  getFolders,
  updateFolder,
  deleteFolder,
} from "@/server/actions/folders";
import { fetchFolderFiles, deleteFile } from "@/server/actions/files";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAuth from "@/hooks/use-auth";
import { DialogClose } from "@radix-ui/react-dialog";
import Link from "next/link";
import { fixArabicFilename } from "@/lib/utils";

export default function WorkspaceList() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [folderFiles, setFolderFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const load = async () => {
    setLoading(true);
    setError("");
    const res = await getFolders();
    if (!res?.success) {
      setError(res?.error || "تعذر جلب المجلدات");
      setFolders([]);
      toast.error(res?.error || "تعذر جلب المجلدات", {
        position: "top-right",
        duration: 3000,
        classNames: "toast-error mt-14",
      });
    } else {
      const list = Array.isArray(res.data) ? res.data : [];
      setFolders(list);
    }
    setLoading(false);
  };

  const handleShowDetails = async (folder) => {
    setSelected(folder);
    setDetailsOpen(true);
    setFilesLoading(true);
    const id = folder._id || folder.id;
    const res = await fetchFolderFiles(id);
    if (res?.success) {
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setFolderFiles(list);
    } else {
      setFolderFiles([]);
      toast.error("تعذر جلب ملفات المجلد");
    }
    setFilesLoading(false);
  };

  const handleDeleteFile = async (fileId) => {
    if (!selected || !fileId) return;
    const folderId = selected._id || selected.id;
    
    const toastId = toast.loading("جارٍ حذف الملف...");
    try {
      const res = await deleteFile(folderId, fileId);
      if (res?.success) {
        toast.success("تم حذف الملف بنجاح", { id: toastId });
        setFolderFiles((prev) => prev.filter((f) => (f._id || f.id) !== fileId));
      } else {
        toast.error(res?.error || "فشل حذف الملف", { id: toastId });
      }
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      const t = setTimeout(() => {
        setLoading(false);
        setFolders([]);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const t = setTimeout(() => load(), 0);
    const fn = () => load();
    window.addEventListener("folders:refresh", fn);
    return () => {
      clearTimeout(t);
      window.removeEventListener("folders:refresh", fn);
    };
  }, [authLoading, isAuthenticated]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg xl:text-xl font-semibold">مساحة العمل</h3>
      </div>
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl p-4 xl:p-5">
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="flex flex-col items-start gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}
      {error && !loading && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      {!loading && !error && (
        <div className="space-y-4">
          {folders.map((f) => {
            const filesCount =
              f.filesCount ??
              (Array.isArray(f.files) ? f.files.length : undefined) ??
              0;
            const createdAt = f.createdAt ? new Date(f.createdAt) : null;
            const dateStr = createdAt
              ? createdAt.toLocaleDateString("ar-EG")
              : "—";
            return (
              <div
                className="bg-card rounded-xl p-4 xl:p-5"
                key={f._id || f.id || f.name}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-foreground/70">
                          اسم المجلد
                        </span>
                        <span className="text-sm font-medium">{f.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground/70">
                          عدد الملفات
                        </span>
                        <span className="text-sm">{filesCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground/70">
                          تاريخ الإنشاء
                        </span>
                        <span className="text-sm">{dateStr}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-xl p-2 text-foreground/80 cursor-pointer hover:bg-foreground/10">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleShowDetails(f)}
                      >
                        تفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setSelected(f);
                          setEditName(f.name || "");
                          setEditOpen(true);
                        }}
                      >
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(f);
                          setDeleteOpen(true);
                        }}
                        className="text-destructive cursor-pointer"
                      >
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <Link
                    href={`/dashboard/folders/${encodeURIComponent(
                      f._id || f.id
                    )}/stages`}
                    prefetch={false}
                    className="group"
                  >
                    <div className="bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg p-4 border border-primary/20 hover:border-primary/40">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-sm font-bold">M</span>
                        </div>
                        <h3 className="font-medium text-sm">المراحل</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        إنشاء وإدارة المراحل التعليمية
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/dashboard/folders/${encodeURIComponent(
                      f._id || f.id
                    )}/flashcards`}
                    prefetch={false}
                    className="group"
                  >
                    <div className="bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg p-4 border border-secondary/20 hover:border-secondary/40">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <span className="text-secondary text-sm font-bold">F</span>
                        </div>
                        <h3 className="font-medium text-sm">كروت الفلاش</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        إنشاء بطاقات تعليمية تفاعلية
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/dashboard/folders/${encodeURIComponent(
                      f._id || f.id
                    )}/tests`}
                    prefetch={false}
                    className="group"
                  >
                    <div className="bg-[#278F5C]/10 hover:bg-[#278F5C]/20 transition-colors rounded-lg p-4 border border-[#278F5C]/20 hover:border-[#278F5C]/40">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-full bg-[#278F5C]/20 flex items-center justify-center">
                          <span className="text-[#278F5C] text-sm font-bold">T</span>
                        </div>
                        <h3 className="font-medium text-sm">الاختبارات</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        إنشاء اختبارات تفاعلية
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
          {folders.length === 0 && (
            <div className="text-sm text-muted-foreground">
              لا توجد مجلدات بعد
            </div>
          )}
        </div>
      )}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 max-w-[92vw]">
          <DialogHeader className="flex flex-row items-center justify-between py-2">
            <DialogClose className="cursor-pointer mb-0">
              <X />
            </DialogClose>
            <DialogTitle className="text-xl font-semibold">
              تعديل اسم المجلد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-12 rounded-xl bg-card border-[#515355]"
            />
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                disabled={busy}
                onClick={async () => {
                  if (!selected) return;
                  setBusy(true);
                  const id = selected._id || selected.id;
                  const res = await updateFolder(id, { name: editName });
                  setBusy(false);
                  if (!res?.success) {
                    toast.error(res?.error || "فشل التعديل", {
                      position: "top-right",
                      duration: 3000,
                      classNames: "toast-error mt-14",
                    });
                    return;
                  }
                  setFolders((prev) =>
                    prev.map((x) =>
                      x._id === id || x.id === id ? { ...x, name: editName } : x
                    )
                  );
                  setEditOpen(false);
                  toast.success("تم تعديل المجلد", {
                    position: "top-right",
                    duration: 3000,
                    classNames: "toast-success mt-14",
                  });
                }}
              >
                حفظ
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setEditOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 max-w-[92vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              حذف المجلد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              هل أنت متأكد من حذف المجلد {selected?.name}؟
            </p>
            <div className="flex items-center gap-4 justify-end">
              <Button
                className="py-5 rounded-lg px-8 cursor-pointer"
                disabled={busy}
                onClick={async () => {
                  if (!selected) return;
                  setBusy(true);
                  const id = selected._id || selected.id;
                  const res = await deleteFolder(id);
                  setBusy(false);
                  if (!res?.success) {
                    toast.error(res?.error || "فشل الحذف", {
                      position: "top-right",
                      duration: 3000,
                      classNames: "toast-error mt-14",
                    });
                    return;
                  }
                  setFolders((prev) =>
                    prev.filter((x) => !(x._id === id || x.id === id))
                  );
                  setDeleteOpen(false);
                  toast.success("تم حذف المجلد", {
                    position: "top-right",
                    duration: 3000,
                    classNames: "toast-success mt-14",
                  });
                }}
              >
                حذف
              </Button>
              <Button
                variant="outline"
                className="py-5 rounded-lg bg-card border-[#515355] cursor-pointer"
                onClick={() => setDeleteOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="border-[#515355] bg-background rounded-2xl p-6 max-w-2xl w-[92vw]">
          <DialogHeader className="flex flex-row items-center justify-between py-2">
            <DialogClose className="cursor-pointer mb-0">
              <X />
            </DialogClose>
            <DialogTitle className="text-xl font-semibold">
              تفاصيل المجلد
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">اسم المجلد</p>
                <p className="font-medium">{selected?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">تاريخ الإنشاء</p>
                <p className="font-medium">
                  {selected?.createdAt
                    ? new Date(selected.createdAt).toLocaleDateString("ar-EG")
                    : "—"}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">الملفات ({folderFiles.length})</h4>
              <div className="bg-card rounded-xl border border-[#515355] overflow-hidden">
                {filesLoading ? (
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : folderFiles.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto">
                    {folderFiles.map((file, i) => (
                      <div
                        key={file._id || i}
                        className="p-3 border-b border-[#515355] last:border-0 flex items-center justify-between hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-primary/10 grid place-items-center text-primary text-xs font-bold">
                            {file.fileName?.split(".").pop()?.toUpperCase() || "FILE"}
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {fixArabicFilename(file.fileName)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file.size
                                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file._id || file.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2 cursor-pointer"
                          title="حذف الملف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    لا توجد ملفات في هذا المجلد
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
