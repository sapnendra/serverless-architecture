import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ADMIN_API_KEY } from "@/config/api";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/feedback/pending`, {
      headers: {
        "X-API-Key": ADMIN_API_KEY,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch pending feedback" },
      { status: 500 }
    );
  }
}
