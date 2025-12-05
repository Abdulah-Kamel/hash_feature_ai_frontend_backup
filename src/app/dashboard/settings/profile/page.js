"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileDetails from "@/components/settings/ProfileDetails";
import PasswordCard from "@/components/settings/PasswordCard";
import LogoutCard from "@/components/settings/LogoutCard";
import { getMyProfile } from "@/server/actions/profile";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profileStore";
import ProfileSkeleton from "@/components/settings/ProfileSkeleton";

export default function ProfileTabPage() {
  const { profile, setProfile, setLoading, loading } = useProfileStore();

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const result = await getMyProfile();
        if (!active) return;
        
        if (result.success) {
          const d = result.data || {};
          setProfile({
            name: d.name || "",
            email: d.email || "",
            phone: d.phone || "",
            country: d.country || "",
            profileImage: d.profileImage || null,
            profileImageUrl: d.profileImageUrl || null,
            position: "طالب",
            specialization: "إدارة أعمال",
            university: "",
            oldPassword: "",
            newPassword: "",
            newPassword2: "",
          });
        } else {
          toast.error(result.error || "فشل تحميل البيانات");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [setProfile, setLoading]);

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="rounded-xl p-4 space-y-2 bg-background">
        <p className="text-2xl font-semibold text-white">تفاصيل الملف</p>
        <p className="text-sm text-muted-foreground">
          إدارة تفاصيل الملف الخاصة بك
        </p>
      </Card>
      {loading ? (
        <>
          <ProfileSkeleton />
          <Card className="rounded-xl p-4 space-y-4 bg-background">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
          </Card>
        </>
      ) : (
        <>
          <ProfileDetails />
          <PasswordCard />
        </>
      )}
      <LogoutCard />
    </div>
  );
}
