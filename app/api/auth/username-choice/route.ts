import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

const USER_JWT_SECRET = process.env.USER_JWT_SECRET as string | undefined;

if (!USER_JWT_SECRET) {
  throw new Error("Veuillez définir USER_JWT_SECRET dans votre environnement.");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username } = body as { username: string };
  const token = req.cookies.get("user_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "non_autorise" }, { status: 401 });
  }
  const payload = jwt.verify(token, USER_JWT_SECRET as string) as any;
  const userId = payload.sub as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "non_autorise" }, { status: 401 });
  }

  if (!username) {
    return NextResponse.json({ error: "missing_username" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await User.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: "username_already_used" }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(userId, { username }, { new: true });
  return NextResponse.json({ success: true });
}