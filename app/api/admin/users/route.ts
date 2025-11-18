// File: app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // Dùng service role để BYPASS RLS và lấy full danh sách Users
    const { data, error } = await supabaseAdmin
      .from("Users")
      .select("UserID, FullName, Email, Role, CreatedAt")
      .order("CreatedAt", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: `Lỗi khi truy vấn Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    console.error("Lỗi máy chủ nội bộ:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ", error: (error as Error).message },
      { status: 500 }
    );
  }
}
