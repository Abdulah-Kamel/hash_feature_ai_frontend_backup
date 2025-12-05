"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changeMyPassword } from "@/server/actions/profile";
import { useProfileStore } from "@/store/profileStore";

export default function PasswordCard() {
  const { profile, updateProfile } = useProfileStore();
  const [changing, setChanging] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  });

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.newPassword2) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    if (passwordData.newPassword !== passwordData.newPassword2) {
      toast.error("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setChanging(true);

    const result = await changeMyPassword({
      currentPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      confirmNewPassword: passwordData.newPassword2,
    });

    if (result.success) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      // Clear password fields
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
      });
    } else {
      toast.error(result.error || "فشل تغيير كلمة المرور");
    }
    setChanging(false);
  };

  if (!profile) return null;

  return (
    <Card className="rounded-xl p-4 space-y-4 bg-background">
      <p className="text-lg font-semibold text-white">كلمة السر</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-white">كلمة السر القديمة</Label>
          <Input 
            type="password" 
            value={passwordData.oldPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} 
            className="bg-card rounded-xl text-white" 
            placeholder="أدخل كلمة المرور الحالية"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white">كلمة السر الجديدة</Label>
          <Input 
            type="password" 
            value={passwordData.newPassword} 
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
            className="bg-card rounded-xl text-white" 
            placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-white">إعادة كلمة السر الجديدة</Label>
          <Input 
            type="password" 
            value={passwordData.newPassword2} 
            onChange={(e) => setPasswordData({ ...passwordData, newPassword2: e.target.value })} 
            className="bg-card rounded-xl text-white" 
            placeholder="أعد إدخال كلمة المرور الجديدة"
          />
        </div>
      </div>
      <Button 
        className="rounded-xl w-32" 
        onClick={handleChangePassword}
        disabled={changing}
      >
        {changing && <Loader2 className="size-4 me-2 animate-spin" />}
        حفظ
      </Button>
    </Card>
  );
}