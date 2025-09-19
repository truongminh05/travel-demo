import { NextResponse } from "next/server";
import { getDbPool, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getDbPool();
    const result = await pool
      .request()
      .query(
        "SELECT UserID, FirstName, LastName, Email, Role, CreatedAt FROM Users"
      );
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}
