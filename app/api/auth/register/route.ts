import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    email,
    password,
  } = body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "missing_fields" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "email_already_used" },
      { status: 400 }
    );
  }

  const user = await User.create({
    email,
    passwordHash: hashPassword(password),
  });

  return NextResponse.json(
    {
      id: user._id.toString(),
      email: user.email,
    },
    { status: 201 }
  );
}

