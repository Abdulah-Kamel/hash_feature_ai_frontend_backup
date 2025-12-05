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
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useFileStore } from "@/store/fileStore";
import { uploadFilesWithProgress, getFileInfo } from "@/lib/upload-utils";
import UploadProgressDialog from "./UploadProgressDialog";
import PostUploadOptionsDialog from "./PostUploadOptionsDialog";

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
  
  // Progress dialog state
  const [showProgress, setShowProgress] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState("uploading");
  const [currentFileName, setCurrentFileName] = React.useState("");
  const [currentFileSize, setCurrentFileSize] = React.useState(0);
  
  // Options dialog state
  const [showOptions, setShowOptions] = React.useState(false);
  const [uploadedFolderId, setUploadedFolderId] = React.useState("");
  const [uploadedFileIds, setUploadedFileIds] = React.useState([]);

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
    else {
      // Reset state when dialog closes (after animation)
      const timer = setTimeout(() => {
        setWorkspace("");
        setSelectedFolderId("");
        setSelectedFiles([]);
        setUploadBusy(false);
      }, 300);
      return () => clearTimeout(timer);
    }
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
  } = useDropzone({
    noClick: true,
    multiple: true,
    onDropAccepted: (files) => setSelectedFiles((prev) => [...prev, ...files]),
  });

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit = selectedFolderId && selectedFiles.length > 0 && !uploadBusy;
  
  const handleSubmit = async (e) => {
              e.preventDefault();
              if (!canSubmit) return;
              
              // Get first file info for display
              const firstFile = selectedFiles[0];
              if (firstFile) {
                const fileInfo = getFileInfo(firstFile);
                setCurrentFileName(fileInfo.name);
                setCurrentFileSize(fileInfo.size);
              }
              
              // Close upload dialog and show progress
              setDialogOpen(false);
              setShowProgress(true);
              setUploadProgress(0);
              setUploadStatus("uploading");
              
              // Start loading state
              setUploadBusy(true);
              setIsUploading(true);
              
              const fd = new FormData();
              fd.append("folderId", selectedFolderId);
              for (const f of selectedFiles) fd.append("files", f);
              
              try {
                const res = await uploadFilesWithProgress(
                  fd,
                  (progress) => setUploadProgress(progress),
                  (status) => setUploadStatus(status)
                );
                
                console.log(res);
                
                if (!res?.success) {
                  setShowProgress(false);
                  toast.error(res?.error || "فشل رفع الملفات", {
                    position: "top-right",
                    duration: 3000,
                  });
                } else {
                  // Show complete status briefly
                  setUploadStatus("complete");
                  setUploadProgress(100);
                  
                  // Extract file IDs from response
                  // API returns: { results: { uploaded: [...], duplicates: [...], failed: [...] } }
                  const uploadedFiles = res.data?.results?.uploaded || [];
                  const duplicateFiles = res.data?.results?.duplicates || [];
                  const failedFiles = res.data?.results?.failed || [];
                  
                  // Combine uploaded and duplicate file IDs
                  const allFiles = [...uploadedFiles, ...duplicateFiles];
                  const fileIds = allFiles.map(f => f._id || f.id).filter(Boolean);
                  
                  console.log("Uploaded file IDs:", fileIds);
                  
                  // Show appropriate message based on results
                  const summary = res.data?.summary;
                  if (summary) {
                    if (summary.duplicates > 0 && summary.uploaded === 0) {
                      toast.warning(`تم تجاهل ${summary.duplicates} ملف مكرر`, {
                        position: "top-right",
                        duration: 3000,
                      });
                    } else if (summary.duplicates > 0) {
                      toast.warning(`تم رفع ${summary.uploaded} ملف، ${summary.duplicates} ملف مكرر`, {
                        position: "top-right",
                        duration: 3000,
                      });
                    } else {
                      toast.success("تم رفع الملفات بنجاح", {
                        position: "top-right",
                        duration: 3000,
                      });
                    }
                    
                    if (summary.failed > 0) {
                      toast.error(`فشل رفع ${summary.failed} ملف`, {
                        position: "top-right",
                        duration: 3000,
                      });
                    }
                  }
                  
                  // Wait a moment then show options dialog
                  setTimeout(() => {
                    setShowProgress(false);
                    setUploadedFolderId(res.folderId || selectedFolderId);
                    setUploadedFileIds(fileIds);
                    setShowOptions(true);
                  }, 800);
                  
                  try {
                    window.dispatchEvent(new Event("files:refresh"));
                  } catch {}
                  try {
                    if (typeof onUploaded === "function") onUploaded(selectedFolderId);
                  } catch {}
                }
              } catch (error) {
                setShowProgress(false);
                console.error("Upload error:", error);
                toast.error(error.message || "حدث خطأ غير متوقع", {
                  position: "top-right",
                  duration: 3000,
                });
              }
              
              setUploadBusy(false);
              setIsUploading(false);
              setSelectedFiles([]);
            };

  return (
    <>
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
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="folderId" value={selectedFolderId} />
            
            {/* Only show file upload section if folder is selected */}
            {selectedFolderId ? (
              <div
                {...getRootProps({
                  className: `rounded-2xl border border-dashed border-[#515355] bg-card p-8 grid place-items-center text-center gap-4 transition-all duration-300 ${
                    isDragActive 
                      ? 'border-primary bg-primary/5 scale-105 shadow-lg' 
                      : 'hover:border-primary/50'
                  }`,
                })}
              >
                <input {...getInputProps({ name: "files" })} />
                <Upload className={`size-8 transition-all duration-300 ${
                  isDragActive ? 'text-primary scale-110' : 'text-muted-foreground'
                }`} />
                <p className={`text-sm transition-colors duration-300 ${
                  isDragActive ? 'text-primary font-medium' : ''
                }`}>
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
                    <ul className="text-xs space-y-2">
                      {selectedFiles.map((f, i) => (
                        <li key={i} className="flex items-center justify-between bg-background/50 p-2 rounded border border-border/50">
                          <span className="text-muted-foreground truncate max-w-[200px]">
                            {f.name} ({Math.round((f.size / 1024 / 1024) * 100) / 100} MB)
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(i);
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#515355] bg-card/50 p-8 grid place-items-center text-center">
                <Upload className="size-8 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  الرجاء اختيار مساحة العمل أولاً
                </p>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
    
    {/* Upload Progress Dialog */}
    <UploadProgressDialog
      open={showProgress}
      progress={uploadProgress}
      fileName={currentFileName}
      fileSize={currentFileSize}
      status={uploadStatus}
    />
    
    {/* Post-Upload Options Dialog */}
    <PostUploadOptionsDialog
      open={showOptions}
      onOpenChange={setShowOptions}
      folderId={uploadedFolderId}
      fileIds={uploadedFileIds}
    />
  </>
  );
}

export default UploadDialogTrigger;
