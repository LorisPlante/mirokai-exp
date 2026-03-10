import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET as string | undefined;

if (!USER_JWT_SECRET) {
  throw new Error("Veuillez définir USER_JWT_SECRET dans votre environnement.");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json(
      { error: "missing_credentials" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const passwordHash = hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: "user",
    },
    USER_JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  const response = NextResponse.json({
    success: true,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
  });

  response.cookies.set("user_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

