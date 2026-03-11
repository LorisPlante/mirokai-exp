import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PlanModule } from "@/models/PlanModule";
import { DEFAULT_MODULES } from "@/lib/planDefaults";

// Lecture publique des positions (pour afficher le plan côté visiteurs)
export async function GET() {
  await connectToDatabase();

  const count = await PlanModule.countDocuments();
  if (count === 0) {
    await PlanModule.insertMany(DEFAULT_MODULES);
  }

  const modules = await PlanModule.find({}, { _id: 0, key: 1, label: 1, description: 1, x: 1, y: 1 })
    .sort({ key: 1 })
    .lean();

  return NextResponse.json({ modules });
}

