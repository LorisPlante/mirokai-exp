import mongoose, { Schema, Model, Document } from "mongoose";

export interface PlanModuleDocument extends Document {
  key: string; // ex: "module-1"
  label: string; // affichage
  description: string; // description
  x: number; // px dans le plan
  y: number; // px dans le plan
  createdAt: Date;
  updatedAt: Date;
}

const PlanModuleSchema = new Schema<PlanModuleDocument>(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String, required: true },
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const PlanModule: Model<PlanModuleDocument> =
  mongoose.models.PlanModule ||
  mongoose.model<PlanModuleDocument>("PlanModule", PlanModuleSchema);

