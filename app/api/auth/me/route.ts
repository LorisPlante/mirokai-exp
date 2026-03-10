import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET as string | undefined;

if (!USER_JWT_SECRET) {
  throw new Error("Veuillez définir USER_JWT_SECRET dans votre environnement.");
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const payload = jwt.verify(token, USER_JWT_SECRET as string) as any;

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: payload.sub,
          username: payload.username,
          email: payload.email,
          role: payload.role ?? "user",
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

