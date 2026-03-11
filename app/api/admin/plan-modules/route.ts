import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PlanModule } from "@/models/PlanModule";
import { DEFAULT_MODULES } from "@/lib/planDefaults";

export async function GET() {
  await connectToDatabase();

  const modules = await PlanModule.find({}, { _id: 0, key: 1, label: 1, description: 1, x: 1, y: 1 })
    .sort({ key: 1 })
    .lean();

  return NextResponse.json({ modules });
}

// Création d'un module (admin)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { key, label, description, x, y } = body as {
    key?: string;
    label?: string;
    description?: string;
    x?: number;
    y?: number;
  };

  if (!key || !label || !description) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  await connectToDatabase();

  const exists = await PlanModule.findOne({ key });
  if (exists) {
    return NextResponse.json({ error: "key_already_exists" }, { status: 409 });
  }

  const created = await PlanModule.create({
    key,
    label,
    description,
    x: typeof x === "number" ? x : 0,
    y: typeof y === "number" ? y : 0,
  });

  return NextResponse.json(
    {
      module: {
        key: created.key,
        label: created.label,
        description: created.description,
        x: created.x,
        y: created.y,
      },
    },
    { status: 201 }
  );
}

// Édition (label/description) d'un module (admin)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { key, label, description } = body as {
    key?: string;
    label?: string;
    description?: string;
  };

  if (!key) {
    return NextResponse.json({ error: "missing_key" }, { status: 400 });
  }

  await connectToDatabase();

  const updated = await PlanModule.findOneAndUpdate(
    { key },
    {
      $set: {
        ...(typeof label === "string" ? { label } : {}),
        ...(typeof description === "string" ? { description } : {}),
      },
    },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, module: updated });
}

// Suppression (admin)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "missing_key" }, { status: 400 });
  }

  await connectToDatabase();

  const deleted = await PlanModule.findOneAndDelete({ key }).lean();
  if (!deleted) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// Mise à jour batch des positions depuis l'admin
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const modules = (body?.modules ?? []) as Array<{
    key: string;
    x: number;
    y: number;
    label?: string;
    description?: string;
  }>;

  if (!Array.isArray(modules) || modules.length === 0) {
    return NextResponse.json({ error: "missing_modules" }, { status: 400 });
  }

  await connectToDatabase();

  await Promise.all(
    modules.map((m) =>
      PlanModule.updateOne(
        { key: m.key },
        {
          $set: {
            ...(typeof m.label === "string" ? { label: m.label } : {}),
            ...(typeof m.description === "string" ? { description: m.description } : {}),
            x: Number(m.x),
            y: Number(m.y),
          },
        },
        { upsert: true }
      )
    )
  );

  return NextResponse.json({ success: true });
}

