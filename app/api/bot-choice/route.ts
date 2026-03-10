import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User, BotChoice } from "@/models/User";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET as string | undefined;

if (!USER_JWT_SECRET) {
  throw new Error("Veuillez définir USER_JWT_SECRET dans votre environnement.");
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("user_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let userId: string | null = null;
  try {
    const payload = jwt.verify(token, USER_JWT_SECRET as string) as any;
    userId = payload.sub ?? null;
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { bot } = body as { bot?: BotChoice };
  if (!bot) {
    return NextResponse.json({ error: "missing_bot" }, { status: 400 });
  }

  await connectToDatabase();

  const userToUpdate = await User.findByIdAndUpdate(
    userId,
    { bot },
    { new: true }
  );

  if (!userToUpdate) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: userToUpdate._id.toString(),
        username: userToUpdate.username,
        email: userToUpdate.email,
        bot: userToUpdate.bot ?? null,
      },
    },
    { status: 200 }
  );
}