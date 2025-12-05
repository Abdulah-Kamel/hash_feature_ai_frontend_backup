import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <Card className="rounded-xl p-4 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Profile Image Skeleton */}
        <div className="flex items-center justify-center">
          <Skeleton className="w-56 h-56 rounded-full" />
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Position and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          {/* Specialization and University */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
