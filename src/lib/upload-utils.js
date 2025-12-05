"use client";

/**
 * Upload files with progress tracking
 * Uses server action to avoid CORS issues, simulates progress based on file size
 * 
 * @param {FormData} formData - FormData containing files and folderId
 * @param {function} onProgress - Callback function to report progress (0-100)
 * @param {function} onStatusChange - Callback to report status changes
 * @returns {Promise<object>} Upload result with success status and data
 */
export async function uploadFilesWithProgress(formData, onProgress, onStatusChange) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get files for size calculation
      const files = formData.getAll("files");
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      // Simulate progress based on file size
      // Small files: quick progress, Large files: slower progress
      const estimatedTime = Math.min(Math.max(totalSize / (1024 * 100), 1000), 10000); // 1-10 seconds
      const progressInterval = 100; // Update every 100ms
      const progressStep = (progressInterval / estimatedTime) * 100;
      
      let currentProgress = 0;
      onStatusChange?.("uploading");
      
      // Start progress simulation
      const progressTimer = setInterval(() => {
        currentProgress = Math.min(currentProgress + progressStep, 95); // Cap at 95% until complete
        onProgress?.(Math.round(currentProgress));
      }, progressInterval);
      
      // Import server action dynamically to avoid circular dependencies
      const { uploadFiles } = await import("@/server/actions/files");
      
      // Call server action (which handles CORS properly)
      const result = await uploadFiles(formData);
      
      // Clear progress timer
      clearInterval(progressTimer);
      
      // Show completion
      onProgress?.(100);
      onStatusChange?.("complete");
      
      if (result.success) {
        resolve({
          success: true,
          data: result.data,
          folderId: formData.get("folderId"),
        });
      } else {
        resolve({
          success: false,
          error: result.error || "Failed to upload files",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      reject(error);
    }
  });
}

/**
 * Get file information from File object
 * @param {File} file - File object
 * @returns {object} File name and size
 */
export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 100 * 1024 * 1024, // 100MB default
    allowedTypes = [],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `حجم الملف يجب أن يكون أقل من ${Math.round(maxSize / (1024 * 1024))} ميجابايت`,
    };
  }

  // Check file type if specified
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "نوع الملف غير مدعوم",
    };
  }

  return {
    valid: true,
  };
}
