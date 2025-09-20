// File: app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Giữ nguyên việc nhận firstName và lastName
    const { email, password, firstName, lastName, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "Họ và tên là bắt buộc" },
        { status: 400 }
      );
    }

    // === THAY ĐỔI QUAN TRỌNG: TỰ ĐỘNG TẠO USERNAME ===
    // 1. Lấy phần đầu của email
    const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    // 2. Tạo một chuỗi ngẫu nhiên ngắn
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    // 3. Ghép lại để tạo username duy nhất
    const generatedUsername = `${emailPrefix}_${randomSuffix}`;

    // Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert vào bảng Users
    const { data, error } = await supabase
      .from("Users")
      .insert([
        {
          Email: email,
          PasswordHash: passwordHash,
          FullName: fullName,
          // Sử dụng username đã được tạo tự động
          Username: generatedUsername,
          Role: role || "user",
        },
      ])
      .select("UserID, Email, FullName, Username, Role")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, message: "Email này đã được đăng ký." },
          { status: 409 }
        );
      }
      // Gửi lại thông báo lỗi cụ thể hơn từ Supabase để dễ debug
      return NextResponse.json(
        { success: false, message: `Lỗi từ cơ sở dữ liệu: ${error.message}` },
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
