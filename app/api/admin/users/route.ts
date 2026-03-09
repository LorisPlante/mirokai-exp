import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "Un utilisateur avec cet email existe déjà" },
      { status: 409 }
    );
  }

  const user = await AdminUser.create({
    email,
    passwordHash: hashPassword(password),
  });

  return NextResponse.json(
    { id: user._id.toString(), email: user.email },
    { status: 201 }
  );
}

