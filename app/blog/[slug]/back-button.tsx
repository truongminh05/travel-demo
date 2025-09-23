"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function BackButton({
  fallback = "/blog",
}: {
  fallback?: string;
}) {
  const router = useRouter();

  const onClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back(); // quay lại trang trước (giữ cả bộ lọc ?category, v.v.)
    } else {
      router.push(fallback); // nếu không có lịch sử, về /blog
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={onClick} aria-label="Quay lại">
      <ArrowLeftIcon className="w-4 h-4 mr-2" />
      Quay lại
    </Button>
  );
}
