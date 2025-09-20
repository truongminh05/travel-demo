// File: app/(admin)/admin/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageIcon,
  UsersIcon,
  DollarSignIcon,
  ActivityIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

async function getDashboardStats() {
  const [
    toursCountPromise,
    usersCountPromise,
    totalRevenuePromise,
    totalBookingsPromise,
  ] = await Promise.all([
    supabase.from("Tours").select("TourID", { count: "exact", head: true }),
    supabase.from("Users").select("UserID", { count: "exact", head: true }),
    supabase.rpc("get_total_revenue").single(),
    supabase.rpc("get_total_bookings_count").single(),
  ]);

  const toursCount = toursCountPromise.count ?? 0;
  const usersCount = usersCountPromise.count ?? 0;

  // === THAY ĐỔI QUAN TRỌNG: Chuyển đổi giá trị nhận được thành số một cách an toàn ===
  // Sử dụng Number() để xử lý các trường hợp null, undefined, hoặc {}
  const totalRevenue = Number(totalRevenuePromise.data) || 0;
  const totalBookings = Number(totalBookingsPromise.data) || 0;

  return { toursCount, usersCount, totalRevenue, totalBookings };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default async function AdminDashboardPage() {
  const { toursCount, usersCount, totalRevenue, totalBookings } =
    await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bảng điều khiển</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Doanh Thu
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng doanh thu từ tất cả booking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số Booking
            </CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số lượt đặt tour thành công
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Tour</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toursCount}</div>
            <p className="text-xs text-muted-foreground">
              Số tour đang được quản lý
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Người dùng đã đăng ký
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{usersCount}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số tài khoản người dùng
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
