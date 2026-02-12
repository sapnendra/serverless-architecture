import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ADMIN_API_KEY } from "@/config/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(
      `${API_BASE_URL}/admin/feedback/${id}/reject`,
      {
        method: "PATCH",
        headers: {
          "X-API-Key": ADMIN_API_KEY,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to reject feedback" },
      { status: 500 }
    );
  }
}
