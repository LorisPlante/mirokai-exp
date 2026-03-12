import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET as string | undefined;

if (!USER_JWT_SECRET) {
  throw new Error("Veuillez définir USER_JWT_SECRET dans votre environnement.");
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("user_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "non_autorise" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, USER_JWT_SECRET as string) as any;
    const userId = payload.sub as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "non_autorise" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { level: 1 } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        level: user.level,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur /api/update-level:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}