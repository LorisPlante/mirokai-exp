import mongoose, { Schema, Model, Document } from "mongoose";

export type BotChoice = "Miroka" | "Miroki" | null;

export interface UserDocument extends Document {
  username: string;
  email: string;
  bot: BotChoice;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bot: { type: String, enum: ["Miroka", "Miroki"], default: null },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

