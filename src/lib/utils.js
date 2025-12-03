import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Utility to fix corrupted UTF-8 filenames
 * This is a workaround for backend encoding issues
 */
export function fixArabicFilename(filename) {
  if (!filename) return filename;
  
  try {
    // Check if the filename looks corrupted (contains mojibake characters)
    if (/[À-ÿÀ-ž]/.test(filename)) {
      // Try to fix double-encoded UTF-8
      const bytes = new Uint8Array(filename.split('').map(c => c.charCodeAt(0) & 0xFF));
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    }
  } catch (error) {
    console.error('Error fixing filename:', error);
  }
  
  return filename;
}

