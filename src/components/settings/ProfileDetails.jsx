"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";
import { useProfileStore } from "@/store/profileStore";

export default function ProfileDetails() {
  const { profile } = useProfileStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!profile) return null;

  const initials = profile?.name?.trim()?.charAt(0) || "م";

  return (
    <>
      <Card className="rounded-xl p-4 space-y-6 bg-background">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-white">تفاصيل الملف الشخصي</p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-xl"
            size="sm"
          >
            <Edit className="size-4 me-2" />
            تعديل الملف
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* Profile Image - Read Only Display */}
          <div className="flex items-center justify-center">
            <Avatar className="w-56 h-56">
              <AvatarImage src={profile?.profileImageUrl} alt={profile?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <Label className="text-white">الإسم</Label>
            <Input 
              value={profile.name} 
              disabled
              className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">البريد الإلكتروني</Label>
                <Input 
                  value={profile.email || ""} 
                  disabled
                  className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">رقم الهاتف</Label>
                <Input 
                  value={profile.phone || ""} 
                  disabled
                  className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">المنصب</Label>
                <Input 
                  value={profile.position} 
                  disabled
                  className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">الدولة</Label>
                <Input 
                  value={profile.country} 
                  disabled
                  className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">التخصص</Label>
                <Input 
                  value={profile.specialization} 
                  disabled
                  className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">الجامعة</Label>
                <Input 
                  value={profile.university} 
                  disabled
                  className="bg-card rounded-xl text-white opacity-60 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <EditProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
