import mongoose, { Schema, Model, Document } from "mongoose";

export interface NewsletterDocument extends Document {
  email: string;
  createdAt: Date;
}

const NewsletterSchema = new Schema<NewsletterDocument>(
  {
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Newsletter: Model<NewsletterDocument> =
  mongoose.models.Newsletter ||
  mongoose.model<NewsletterDocument>("Newsletter", NewsletterSchema);