// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    if (!fullName) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ và tên" },
        { status: 400 }
      );
    }

    // Tạo username từ email
    const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const generatedUsername = `${baseUsername}_${randomSuffix}`;

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from("Users")
      .insert({
        Email: email,
        PasswordHash: passwordHash,
        FullName: fullName,
        Username: generatedUsername,
        Phone: phone ?? null,
        Role: "user", // luôn là user thường khi đăng ký
      })
      .select()
      .single();

    if (error) {
      console.error("Register error:", error);
      if ((error as any).code === "23505") {
        // unique violation: email trùng
        return NextResponse.json(
          { error: "Email này đã được đăng ký." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Có lỗi khi tạo tài khoản" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (err) {
    console.error("Register exception:", err);
    return NextResponse.json(
      { error: "Lỗi server khi đăng ký" },
      { status: 500 }
    );
  }
}
