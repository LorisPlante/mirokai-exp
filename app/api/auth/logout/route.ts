import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    // Déconnexion : supprimer le cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("user_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }