import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

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
    const userId = payload.sub as string | undefined;

    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: "user",
          avatar: user.avatar ?? null,
          map: user.map ?? null,
          level: user.level ?? 1,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

