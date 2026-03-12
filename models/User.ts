import mongoose, { Schema, Model, Document } from "mongoose";

export type AvatarChoice = "Avatar1" | "Avatar2" | "Avatar3" | "Avatar4" | "Avatar5" | null;
export type MapChoice = "Map1" | "Map2" | "Map3" | "Map4" | null;

export interface UserDocument extends Document {
  username: string;
  email: string;
  avatar: AvatarChoice;
  map: MapChoice;
  level: number;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: {
      type: String,
      enum: ["Avatar1", "Avatar2", "Avatar3", "Avatar4", "Avatar5", null],
      default: null,
    },
    map: {
      type: String,
      enum: ["Map1", "Map2", "Map3", "Map4", null],
      default: null,
    },
    level: { type: Number, default: 1 },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

