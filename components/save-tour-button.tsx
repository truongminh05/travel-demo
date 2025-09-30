"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SaveTourButtonProps {
  tourId: number;
  tourSlug?: string;
  initialSaved?: boolean;
  compact?: boolean;
}

export function SaveTourButton({
  tourId,
  tourSlug,
  initialSaved = false,
  compact = false,
}: SaveTourButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthRedirect = () => {
    const target = tourSlug ? `/tours/${tourSlug}` : window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(target)}`);
  };

  const toggleSave = async () => {
    if (status !== "authenticated") {
      handleAuthRedirect();
      return;
    }

    try {
      setIsLoading(true);
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(`/api/tours/${tourId}/wishlist`, {
        method,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Không thể cập nhật yêu thích");
      }

      setIsSaved((prev) => !prev);
      toast({
        title: isSaved ? "Đã bỏ khỏi yêu thích" : "Đã lưu tour",
      });
      router.refresh();
    } catch (error) {
      console.error("toggle wishlist error", error);
      toast({
        title: "Thao tác thất bại",
        description:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật danh sách yêu thích",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <Button
        variant={isSaved ? "secondary" : "outline"}
        size="sm"
        onClick={toggleSave}
        disabled={isLoading}
        className={isSaved ? "bg-rose-100 text-rose-600" : undefined}
      >
        <HeartIcon
          className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
        />
        {isSaved ? "Đã lưu" : "Lưu tour"}
      </Button>
    );
  }

  return (
    <Button
      variant={isSaved ? "secondary" : "outline"}
      onClick={toggleSave}
      disabled={isLoading}
      className={`flex items-center gap-2 ${isSaved ? "bg-rose-100 text-rose-600" : ""}`}
    >
      <HeartIcon className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Đã lưu" : "Lưu vào yêu thích"}
    </Button>
  );
}
