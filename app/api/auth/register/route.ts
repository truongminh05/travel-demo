// File: route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // THAY ĐỔI 1: Nhận firstName và lastName thay vì fullName
    const { email, password, firstName, lastName, username, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // THAY ĐỔI 2: Tạo fullName từ firstName và lastName
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "Họ và tên là bắt buộc" },
        { status: 400 }
      );
    }

    // Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert vào bảng Users
    const { data, error } = await supabase
      .from("Users")
      .insert([
        {
          Email: email,
          PasswordHash: passwordHash,
          // THAY ĐỔI 3: Sử dụng biến fullName đã được tạo
          FullName: fullName,
          Username: username || null,
          Role: role || "user",
        },
      ])
      .select("UserID, Email, FullName, Username, Role")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Cung cấp thông báo lỗi rõ ràng hơn
      if (error.code === "23505") {
        // Lỗi unique constraint (ví dụ: email đã tồn tại)
        return NextResponse.json(
          { success: false, message: "Email này đã được sử dụng." },
          { status: 409 } // 409 Conflict
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "Không thể tạo tài khoản do lỗi từ máy chủ.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ nội bộ không xác định." },
      { status: 500 }
    );
  }
}
