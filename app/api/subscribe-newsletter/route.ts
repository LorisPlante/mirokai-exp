import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Newsletter } from "@/models/Newsletter";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "error_email_required" }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "error_already_subscribed" }, { status: 400 });
  }

  const newsletter = await Newsletter.create({ email });
  return NextResponse.json({ newsletter }, { status: 201 });
}