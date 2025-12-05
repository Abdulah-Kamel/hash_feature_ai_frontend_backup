"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen, CreditCard, HelpCircle, Sparkles, X, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

/**
 * Post-upload options dialog component
 * Multi-step process: Select content type → Enter title → Generate
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {string} folderId - ID of the folder containing uploaded files
 * @param {array} fileIds - IDs of the uploaded files
 */
export default function PostUploadOptionsDialog({
  open,
  onOpenChange,
  folderId,
  fileIds = [],
}) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Select type, 2: Enter title
  const [selectedType, setSelectedType] = useState(null); // 'stages', 'flashcards', 'mcqs', 'all'
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);

  // Debug: Log props
  console.log("PostUploadOptionsDialog props:", { folderId, fileIds });

  /**
   * Reset dialog state when closed
   */
  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setTitle("");
    setGenerating(false);
    onOpenChange(false);
  };

  /**
   * Handle content type selection
   */
  const handleSelectType = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  /**
   * Generate content with title and file IDs
   */
  const handleGenerate = async (type, contentTitle) => {
    if (!folderId) {
      toast.error("معرف المجلد مفقود");
      return false;
    }

    if (!contentTitle?.trim()) {
      toast.error("العنوان مطلوب");
      return false;
    }

    const endpoint = type === 'stages' ? '/api/ai/stages' 
                   : type === 'flashcards' ? '/api/ai/flashcards'
                   : '/api/ai/mcq';

    try {
      // Prepare request body
      const requestBody = {
        title: contentTitle.trim(),
        folderId: folderId,
        fileIds: fileIds,
      };
      
      console.log("Generating content with:", requestBody);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `فشل إنشاء ${getTypeName(type)}`);
      }

      toast.success(`تم إنشاء ${getTypeName(type)} بنجاح`, {
        position: "top-right",
        duration: 3000,
      });

      // Dispatch refresh event
      const eventName = type === 'stages' ? 'stages:refresh'
                      : type === 'flashcards' ? 'flashcards:refresh'
                      : 'mcq:refresh';
      window.dispatchEvent(new Event(eventName));

      return true;
    } catch (error) {
      console.error(`Generate ${type} error:`, error);
      toast.error(error.message || `حدث خطأ أثناء إنشاء ${getTypeName(type)}`);
      return false;
    }
  };

  /**
   * Get Arabic name for content type
   */
  const getTypeName = (type) => {
    switch (type) {
      case 'stages': return 'المراحل';
      case 'flashcards': return 'البطاقات التعليمية';
      case 'mcqs': return 'الأسئلة';
      default: return 'المحتوى';
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان");
      return;
    }

    setGenerating(true);

    if (selectedType === 'all') {
      // Generate all three types with the same title
      const results = await Promise.all([
        handleGenerate('stages', title),
        handleGenerate('flashcards', title),
        handleGenerate('mcqs', title),
      ]);

      if (results.every(r => r)) {
        toast.success("تم إنشاء جميع المحتويات بنجاح", {
          position: "top-right",
          duration: 3000,
        });
        
        // Navigate to stages page (first generated content) after short delay
        setTimeout(() => {
          handleClose();
          router.push(`/dashboard/folders/${folderId}/stages`);
        }, 1000);
      }
    } else {
      // Generate single type
      const success = await handleGenerate(selectedType, title);
      if (success) {
        // Navigate to the specific content type page
        const contentPath = selectedType === 'stages' ? 'stages'
                          : selectedType === 'flashcards' ? 'flashcards'
                          : 'mcq';
        
        setTimeout(() => {
          handleClose();
          router.push(`/dashboard/folders/${folderId}/${contentPath}`);
        }, 1000);
      }
    }

    setGenerating(false);
  };

  /**
   * Go back to type selection
   */
  const handleBack = () => {
    setStep(1);
    setTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "ماذا تريد أن تنشئ؟" : "أدخل عنوان المحتوى"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "اختر نوع المحتوى الذي تريد إنشاءه من الملف المرفوع"
              : `سيتم إنشاء ${getTypeName(selectedType)} بهذا العنوان`
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          // Step 1: Select content type
          <div className="space-y-3 py-4">
            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleSelectType('stages')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">مراحل تعليمية</p>
                  <p className="text-xs text-muted-foreground">
                    إنشاء مراحل تعليمية تفاعلية
                  </p>
                </div>
                <ArrowLeft className="size-5 text-muted-foreground" />
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleSelectType('flashcards')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <CreditCard className="size-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">بطاقات تعليمية</p>
                  <p className="text-xs text-muted-foreground">
                    إنشاء بطاقات تعليمية للمراجعة
                  </p>
                </div>
                <ArrowLeft className="size-5 text-muted-foreground" />
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleSelectType('mcqs')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-3">
                  <HelpCircle className="size-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">أسئلة اختيار متعدد</p>
                  <p className="text-xs text-muted-foreground">
                    إنشاء أسئلة اختبار متعددة الخيارات
                  </p>
                </div>
                <ArrowLeft className="size-5 text-muted-foreground" />
              </div>
            </Card>

            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors border-primary/50"
              onClick={() => handleSelectType('all')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-linear-to-br from-primary to-blue-500 p-3">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">إنشاء الكل</p>
                  <p className="text-xs text-muted-foreground">
                    إنشاء جميع أنواع المحتوى
                  </p>
                </div>
                <ArrowLeft className="size-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        ) : (
          // Step 2: Enter title
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content-title">العنوان *</Label>
              <Input
                id="content-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: الفصل الأول - مقدمة في البرمجة"
                className="bg-card rounded-xl"
                disabled={generating}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                سيتم استخدام هذا العنوان لتسمية المحتوى المُنشأ
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={generating}
                className="rounded-xl"
              >
                <ArrowRight className="size-4 me-2" />
                رجوع
              </Button>
              <Button
                type="submit"
                disabled={generating || !title.trim()}
                className="rounded-xl"
              >
                {generating ? (
                  <Loader2 className="size-4 me-2 animate-spin" />
                ) : (
                  <Sparkles className="size-4 me-2" />
                )}
                {generating ? "جاري الإنشاء..." : "إنشاء"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 1 && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-xl w-full"
            >
              <X className="size-4 me-2" />
              تخطي
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
