"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileDetails({ profile, setProfile }) {
  return (
    <Card className="rounded-xl p-4 space-y-6 bg-background">
      <p className="text-lg font-semibold text-white">تفاصيل الملف الشخصي</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <Card className="rounded-2xl border bg-card w-full max-w-sm h-56 grid place-items-center">
            <div className="text-center space-y-2">
              <ImagePlus className="size-10 mx-auto" />
              <p className="text-white/90">أرفق الملف هنا</p>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Label className="text-white">الإسم</Label>
          <Input value={profile.name} onChange={(e)=>setProfile(p=>({...p,name:e.target.value}))} className="bg-card rounded-xl text-white" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">البريد الإلكتروني</Label>
              <Input value={profile.email || ""} onChange={(e)=>setProfile(p=>({...p,email:e.target.value}))} type="email" className="bg-card rounded-xl text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white">رقم الهاتف</Label>
              <Input value={profile.phone || ""} onChange={(e)=>setProfile(p=>({...p,phone:e.target.value}))} className="bg-card rounded-xl text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">المنصب</Label>
              <Select value={profile.position} onValueChange={(v)=>setProfile(p=>({...p,position:v}))}>
                <SelectTrigger className="bg-card rounded-xl w-full cursor-pointer">
                  <SelectValue placeholder="اختر المنصب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="طالب">طالب</SelectItem>
                  <SelectItem value="مدرّس">مدرّس</SelectItem>
                  <SelectItem value="باحث">باحث</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">الدولة</Label>
              <Input value={profile.country} onChange={(e)=>setProfile(p=>({...p,country:e.target.value}))} className="bg-card rounded-xl text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">التخصص</Label>
              <Select value={profile.specialization} onValueChange={(v)=>setProfile(p=>({...p,specialization:v}))}>
                <SelectTrigger className="bg-card rounded-xl w-full cursor-pointer">
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="إدارة أعمال">إدارة أعمال</SelectItem>
                  <SelectItem value="علوم حاسوب">علوم حاسوب</SelectItem>
                  <SelectItem value="هندسة">هندسة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">الجامعة</Label>
              <Input value={profile.university} onChange={(e)=>setProfile(p=>({...p,university:e.target.value}))} className="bg-card rounded-xl text-white" />
            </div>
          </div>
          <Button className="rounded-xl w-32">حفظ</Button>
        </div>
      </div>
    </Card>
  );
}
