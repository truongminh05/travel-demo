import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, username, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
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
          FullName: fullName || null,
          Username: username || null,
          Role: role || "user",
        },
      ])
      .select("UserID, Email, FullName, Username, Role")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, message: "Không thể tạo tài khoản" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
