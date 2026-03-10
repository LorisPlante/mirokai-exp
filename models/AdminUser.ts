import mongoose, { Schema, Model, Document } from "mongoose";

export interface AdminUserDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminUserSchema = new Schema<AdminUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AdminUser: Model<AdminUserDocument> =
  mongoose.models.AdminUser ||
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);