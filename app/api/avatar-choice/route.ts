import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET as string | undefined;

if (!USER_JWT_SECRET) {
  throw new Error("Veuillez définir USER_JWT_SECRET dans votre environnement.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { avatar, map } = body as { avatar: string; map: string };

    const token = req.cookies.get("user_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "non_autorise" }, { status: 401 });
    }

    const payload = jwt.verify(token, USER_JWT_SECRET as string) as any;
    const userId = payload.sub as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "non_autorise" }, { status: 401 });
    }

    if (!avatar || !map) {
      return NextResponse.json(
        { error: "missing_avatar_or_map" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar, map },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "user_not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Erreur /api/avatar-choice:", err);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}