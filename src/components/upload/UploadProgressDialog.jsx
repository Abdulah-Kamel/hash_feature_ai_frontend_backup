"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, FileUp, CheckCircle2 } from "lucide-react";

/**
 * Upload progress dialog component
 * Displays real-time upload progress with percentage and file information
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {number} progress - Upload progress percentage (0-100)
 * @param {string} fileName - Name of the file being uploaded
 * @param {number} fileSize - Size of the file in bytes
 * @param {string} status - Current upload status: 'uploading' | 'processing' | 'complete'
 */
export default function UploadProgressDialog({
  open,
  progress = 0,
  fileName = "",
  fileSize = 0,
  status = "uploading",
}) {
  /**
   * Format file size to human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size (e.g., "2.5 MB")
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  /**
   * Get status display information
   * @returns {object} Status icon, text, and color
   */
  const getStatusInfo = () => {
    switch (status) {
      case "uploading":
        return {
          icon: <Loader2 className="size-6 animate-spin text-primary" />,
          text: "جاري الرفع...",
          color: "text-primary",
        };
      case "processing":
        return {
          icon: <Loader2 className="size-6 animate-spin text-blue-500" />,
          text: "جاري المعالجة...",
          color: "text-blue-500",
        };
      case "complete":
        return {
          icon: <CheckCircle2 className="size-6 text-green-500" />,
          text: "اكتمل الرفع",
          color: "text-green-500",
        };
      default:
        return {
          icon: <FileUp className="size-6 text-muted-foreground" />,
          text: "جاري الرفع...",
          color: "text-muted-foreground",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        dir="rtl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>رفع الملف</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Icon and Text */}
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-muted p-4">
              {statusInfo.icon}
            </div>
            <p className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">التقدم</span>
              <span className="font-semibold">{clampedProgress}%</span>
            </div>
            <Progress value={clampedProgress} className="h-2" />
          </div>

          {/* File Information */}
          {fileName && (
            <div className="space-y-1 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">اسم الملف</span>
                <span className="text-xs font-medium truncate max-w-[200px]">
                  {fileName}
                </span>
              </div>
              {fileSize > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">الحجم</span>
                  <span className="text-xs font-medium">
                    {formatFileSize(fileSize)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
