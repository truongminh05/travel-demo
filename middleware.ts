import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` tăng cường `request` của bạn với `token` của người dùng.
  function middleware(request) {
    const { token } = request.nextauth;
    const { pathname } = request.nextUrl;

    // --- Logic phân quyền cho trang Admin ---
    if (pathname.startsWith("/admin") && token?.role !== "Admin") {
      // Nếu người dùng không phải Admin và đang cố truy cập trang admin,
      // chuyển hướng họ về trang chủ.
      return NextResponse.redirect(new URL("/", request.url));
    }
  },
  {
    callbacks: {
      // Hàm này chỉ cần kiểm tra xem người dùng đã đăng nhập hay chưa.
      // Logic phân quyền chi tiết đã được xử lý trong hàm middleware ở trên.
      authorized: ({ token }) => !!token,
    },
  }
);

// Áp dụng middleware cho các trang cần bảo vệ
export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
