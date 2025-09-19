import type React from "react";
import { AdminSidebar } from "@/components/admin-sidebar"; // Chúng ta sẽ tạo component này ngay sau đây
import { SiteHeader } from "@/components/site-header"; // Tái sử dụng header
import { createClient } from "@supabase/supabase-js";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:py-4 sm:pl-14">
        {/* Bạn có thể tạo một header riêng cho admin nếu muốn */}
        {/* <SiteHeader /> */}
        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
