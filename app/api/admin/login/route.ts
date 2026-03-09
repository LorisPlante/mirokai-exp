import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { hashPassword } from "@/lib/auth";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET as string | undefined;

if (!ADMIN_JWT_SECRET) {
  throw new Error("Veuillez définir ADMIN_JWT_SECRET dans votre environnement.");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body as { email: string; password: string };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const user = await AdminUser.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const passwordHash = hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const token = jwt.sign(
    { sub: user._id.toString(), email: user.email, role: "admin" },
    ADMIN_JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

