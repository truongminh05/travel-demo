// File: app/api/admin/users/route.ts

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // THAY ĐỔI: Thay thế FirstName, LastName bằng FullName
    const { data, error } = await supabase
      .from("Users")
      .select("UserID, FullName, Email, Role, CreatedAt");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: `Lỗi khi truy vấn Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi máy chủ nội bộ:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ", error: (error as Error).message },
      { status: 500 }
    );
  }
}
