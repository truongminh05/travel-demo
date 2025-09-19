import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("UserID, FirstName, LastName, Email, Role, CreatedAt");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Lỗi khi truy vấn Supabase" },
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
