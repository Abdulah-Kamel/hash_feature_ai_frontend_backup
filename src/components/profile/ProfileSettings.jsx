"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import {
  getMyProfile,
  updateMyProfile,
  updateMyProfileImage,
  removeMyProfileImage,
  changeMyPassword,
} from "@/server/actions/profile";

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getMyProfile();
    if (result.success) {
      setProfile(result.data);
      setFormData({
        name: result.data.name || "",
        country: result.data.country || "",
      });
      
      // Load profile image if available
      if (result.data.profileImage) {
        setProfileImage(result.data.profileImage);
      }
    } else {
      toast.error(result.error || "فشل تحميل الملف الشخصي");
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const result = await updateMyProfile(formData);
    if (result.success) {
      setProfile(result.data);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } else {
      toast.error(result.error || "فشل تحديث الملف الشخصي");
    }
    setUpdating(false);
  };

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
      // Reload profile to get new image
      await loadProfile();
    } else {
      toast.error(result.error || "فشل تحميل الصورة");
    }
    setUploadingImage(false);
  };

  const handleRemoveImage = async () => {
    setUploadingImage(true);
    const result = await removeMyProfileImage();
    if (result.success) {
      setProfileImage(null);
      toast.success("تم حذف صورة الملف الشخصي بنجاح");
    } else {
      toast.error(result.error || "فشل حذف الصورة");
    }
    setUploadingImage(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setChangingPassword(true);

    const result = await changeMyPassword(passwordData);
    if (result.success) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } else {
      toast.error(result.error || "فشل تغيير كلمة المرور");
    }
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = profile?.name?.trim()?.charAt(0) || "م";

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Profile Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>الصورة الشخصية</CardTitle>
            <CardDescription>قم بتحديث صورة ملفك الشخصي</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="size-32">
                <AvatarImage src={profileImage} alt={profile?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="size-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                variant="outline"
              >
                <Camera className="size-4 me-2" />
                تحميل صورة
              </Button>
              {profileImage && (
                <Button
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4 me-2" />
                  حذف الصورة
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-sm text-muted-foreground text-center">
              JPG, PNG أو WEBP. الحد الأقصى 5 ميجابايت
            </p>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
            <CardDescription>قم بتحديث معلومات ملفك الشخصي</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  لا يمكن تغيير البريد الإلكتروني
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">البلد</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="أدخل بلدك"
                />
              </div>
              <Button type="submit" disabled={updating} className="w-full">
                {updating && <Loader2 className="size-4 me-2 animate-spin" />}
                حفظ التغييرات
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
            <CardDescription>قم بتحديث كلمة مرورك</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                  }
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                />
              </div>
              <Button type="submit" disabled={changingPassword} className="w-full">
                {changingPassword && <Loader2 className="size-4 me-2 animate-spin" />}
                تغيير كلمة المرور
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
