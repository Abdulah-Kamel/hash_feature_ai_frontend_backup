"use client";
import * as React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getFolders } from "@/server/actions/folders";
import useAuth from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadFiles } from "@/server/actions/files";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useFileStore } from "@/store/fileStore";

function UploadDialogTrigger({ children, onUploaded }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [workspace, setWorkspace] = React.useState("");
  const [folders, setFolders] = React.useState([]);
  const [foldersLoading, setFoldersLoading] = React.useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedFolderId, setSelectedFolderId] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploadBusy, setUploadBusy] = React.useState(false);
  const setIsUploading = useFileStore((s) => s.setIsUploading);

  const loadFolders = React.useCallback(async () => {
    if (authLoading || !isAuthenticated) return;
    setFoldersLoading(true);
    const res = await getFolders();
    if (res?.success && Array.isArray(res.data)) {
      setFolders(res.data);
    } else {
      setFolders([]);
    }
    setFoldersLoading(false);
  }, [authLoading, isAuthenticated]);

  React.useEffect(() => {
    if (dialogOpen) loadFolders();
  }, [dialogOpen, loadFolders]);

  const onSelectFolder = (f) => {
    setWorkspace(f.name);
    setSelectedFolderId(f._id || f.id || "");
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
    acceptedFiles,
  } = useDropzone({
    noClick: true,
    multiple: true,
    onDropAccepted: (files) => setSelectedFiles(files),
  });
  React.useEffect(() => {
    setSelectedFiles(acceptedFiles);
  }, [acceptedFiles]);

  const canSubmit = selectedFolderId && selectedFiles.length > 0 && !uploadBusy;
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-[#515355] bg-background rounded-2xl p-6">
        <DialogHeader className="justify-center">
          <DialogTitle className="text-xl font-semibold text-muted-foreground">
            ارفع الملف
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <button className="absolute top-4 right-4 size-8 grid place-items-center rounded-md bg-card">
            <X className="size-4 cursor-pointer" />
          </button>
        </DialogClose>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">مساحة العمل</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between h-12 w-full rounded-xl border px-3 bg-card border-[#515355] cursor-pointer">
                  <span className="text-sm text-foreground/80">
                    {workspace || "اختر مساحة العمل"}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full">
                <DropdownMenuLabel>اختار مساحة العمل</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {foldersLoading && (
                  <div className="p-2 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                )}
                {!foldersLoading &&
                  folders.length > 0 &&
                  folders.map((f) => (
                    <DropdownMenuItem
                      className="w-full cursor-pointer"
                      key={f._id || f.id || f.name}
                      onSelect={() => onSelectFolder(f)}
                    >
                      {f.name}
                    </DropdownMenuItem>
                  ))}
                {!foldersLoading && folders.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">
                    لا توجد مجلدات
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!canSubmit) return;
              
              // Close dialog immediately
              setDialogOpen(false);
              
              // Start loading state
              setUploadBusy(true);
              setIsUploading(true);
              
              const fd = new FormData();
              fd.append("folderId", selectedFolderId);
              for (const f of selectedFiles) fd.append("files", f);
              
              try {
                const res = await uploadFiles(fd);
                if (!res?.success) {
                  toast.error(res?.error || "فشل رفع الملفات", {
                    position: "top-right",
                    duration: 3000,
                    classNames: "toast-error mt-14",
                  });
                } else {
                  toast.success("تم رفع الملفات بنجاح", {
                    position: "top-right",
                    duration: 3000,
                    classNames: "toast-success mt-14",
                  });
                  try {
                    window.dispatchEvent(new Event("files:refresh"));
                  } catch {}
                  try {
                    if (typeof onUploaded === "function") onUploaded(selectedFolderId);
                  } catch {}
                }
              } catch {
                toast.error("حدث خطأ غير متوقع", {
                  position: "top-right",
                  duration: 3000,
                  classNames: "toast-error mt-14",
                });
              }
              
              setUploadBusy(false);
              setIsUploading(false);
              setSelectedFiles([]);
            }}
          >
            <input type="hidden" name="folderId" value={selectedFolderId} />
            <div
              {...getRootProps({
                className:
                  "rounded-2xl border border-dashed border-[#515355] bg-card p-8 grid place-items-center text-center gap-4",
              })}
            >
              <input {...getInputProps({ name: "files" })} />
              <Upload className="size-8 text-muted-foreground" />
              <p className="text-sm">
                {isDragActive
                  ? "أسقط الملفات هنا"
                  : "اسحب وأفلت الملفات هنا أو اخترها"}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => openFileDialog()}
                  className="bg-primary text-primary-foreground px-10 py-5 cursor-pointer"
                >
                  اختر الملفات
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || uploadBusy}
                  className="bg-secondary text-white px-10 py-5 cursor-pointer disabled:opacity-60"
                >
                  ارفع الملف
                </Button>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4 text-left w-full">
                  <p className="text-sm mb-2">الملفات المختارة:</p>
                  <ul className="text-xs space-y-1">
                    {selectedFiles.map((f, i) => (
                      <li key={i} className="text-muted-foreground">
                        {f.name} (
                        {Math.round((f.size / 1024 / 1024) * 100) / 100} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDialogTrigger;
