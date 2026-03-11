import mongoose, { Schema, Model, Document } from "mongoose";

export type BotChoice = "Miroka" | "Miroki" | null;
export type AvatarChoice = "Avatar1" | "Avatar2" | "Avatar3" | null;
export type MapChoice = "Map1" | "Map2" | "Map3" | null;
export type ClothesChoice = "Clothes1" | "Clothes2" | "Clothes3" | "Clothes4" | "Clothes5" | "Clothes6" | null;

export interface UserDocument extends Document {
  username: string;
  email: string;
  bot: BotChoice;
  avatar: AvatarChoice;
  map: MapChoice;
  clothes: ClothesChoice;
  level: number;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bot: { type: String, enum: ["Miroka", "Miroki"], default: null },
    avatar: { type: String, enum: ["Avatar1", "Avatar2", "Avatar3"], default: null },
    map: { type: String, enum: ["Map1", "Map2", "Map3"], default: null },
    clothes: { type: String, enum: ["Clothes1", "Clothes2", "Clothes3", "Clothes4", "Clothes5", "Clothes6"], default: null },
    level: { type: Number, default: 1 },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

