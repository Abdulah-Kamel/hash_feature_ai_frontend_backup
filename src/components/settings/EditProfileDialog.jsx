"use client";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, Trash2, ImagePlus, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { updateMyProfile, updateMyProfileImage, removeMyProfileImage } from "@/server/actions/profile";
import { useProfileStore } from "@/store/profileStore";

export default function EditProfileDialog({ open, onOpenChange }) {
  const { profile, updateProfile, updateProfileImage, removeProfileImage: removeProfileImageStore } = useProfileStore();
  
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    position: "",
    specialization: "",
    university: "",
  });
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Update form when profile changes or dialog opens
  useEffect(() => {
    if (profile && open) {
      setFormData({
        name: profile.name || "",
        country: profile.country || "",
        position: profile.position || "",
        specialization: profile.specialization || "",
        university: profile.university || "",
      });
      setTempProfileImage(profile.profileImageUrl || null);
    }
  }, [profile, open]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    const result = await updateMyProfileImage(formData);
    if (result.success) {
      toast.success("تم تحديث صورة الملف الشخصي بنجاح");
      
      // Extract image URL from various possible response structures
      let imageUrl = null;
      
      if (result.data?.profileImage?.url) {
        imageUrl = result.data.profileImage.url;
      } else if (result.data?.profileImageUrl) {
        imageUrl = result.data.profileImageUrl;
      } else if (result.data?.url) {
        imageUrl = result.data.url;
      }
      
      console.log("Image upload result:", result.data);
      console.log("Extracted image URL:", imageUrl);
      
      if (imageUrl) {
        // Update temp image for preview in dialog
        setTempProfileImage(imageUrl);
        // Update store immediately for all components
        updateProfileImage(imageUrl);
      } else {
        console.warn("Could not extract image URL from response:", result.data);
      }
    } else {
      toast.error(result.error || "فشل تحميل الصورة");
    }
    setUploadingImage(false);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setUploadingImage(true);
    const result = await removeMyProfileImage();
    if (result.success) {
      setTempProfileImage(null);
      // Update store immediately
      removeProfileImageStore();
      toast.success("تم حذف صورة الملف الشخصي بنجاح");
    } else {
      toast.error(result.error || "فشل حذف الصورة");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name?.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }

    setUpdating(true);

    const result = await updateMyProfile({
      name: formData.name,
      country: formData.country,
    });

    if (result.success) {
      // Show success state
      setSuccess(true);
      toast.success("تم تحديث الملف الشخصي بنجاح");
      
      // Update store with all form data
      updateProfile({
        ...formData,
        ...result.data,
      });
      
      // Delay closing to show success animation
      setTimeout(() => {
        setSuccess(false);
        setUpdating(false);
        onOpenChange(false);
      }, 800);
    } else {
      toast.error(result.error || "فشل تحديث الملف الشخصي");
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (profile) {
      setFormData({
        name: profile.name || "",
        country: profile.country || "",
        position: profile.position || "",
        specialization: profile.specialization || "",
        university: profile.university || "",
      });
      setTempProfileImage(profile.profileImageUrl || null);
    }
    onOpenChange(false);
  };

  const initials = formData.name?.trim()?.charAt(0) || profile?.name?.trim()?.charAt(0) || "م";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          <DialogDescription>
            قم بتحديث معلومات ملفك الشخصي
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Profile Image Section */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {tempProfileImage ? (
                  <div className="relative w-32 h-32">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={tempProfileImage} alt={formData.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {uploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Loader2 className="size-6 animate-spin text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-8 w-8"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        <Camera className="size-3" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="rounded-full h-8 w-8"
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card 
                    className="rounded-2xl border bg-card w-32 h-32 grid place-items-center cursor-pointer hover:bg-card/80 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center space-y-1">
                      {uploadingImage ? (
                        <Loader2 className="size-8 mx-auto animate-spin" />
                      ) : (
                        <>
                          <ImagePlus className="size-8 mx-auto" />
                          <p className="text-xs text-white/90">أرفق صورة</p>
                        </>
                      )}
                    </div>
                  </Card>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">الاسم *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card rounded-xl"
                placeholder="أدخل اسمك"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-country">الدولة</Label>
              <Input
                id="edit-country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-card rounded-xl"
                placeholder="أدخل دولتك"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-position">المنصب</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="bg-card rounded-xl"
                placeholder="أدخل منصبك"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-specialization">التخصص</Label>
              <Input
                id="edit-specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="bg-card rounded-xl"
                placeholder="أدخل تخصصك"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-university">الجامعة</Label>
              <Input
                id="edit-university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="bg-card rounded-xl"
                placeholder="أدخل جامعتك"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updating}
              className="rounded-xl"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={updating}
              className={`rounded-xl transition-all ${success ? 'bg-green-600 hover:bg-green-600' : ''}`}
            >
              {success ? (
                <Check className="size-4 me-2 animate-in zoom-in duration-300" />
              ) : updating ? (
                <Loader2 className="size-4 me-2 animate-spin" />
              ) : null}
              {success ? 'تم الحفظ' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
