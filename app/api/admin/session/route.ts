import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET as string | undefined;

if (!ADMIN_JWT_SECRET) {
  throw new Error("Veuillez définir ADMIN_JWT_SECRET dans votre environnement.");
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET as string) as unknown as {
      sub: string;
      email: string;
      role: string;
    };

    return NextResponse.json({
      authenticated: true,
      user: { id: payload.sub, email: payload.email, role: payload.role },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export async function DELETE(req: NextRequest) {
  // Déconnexion : supprimer le cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

