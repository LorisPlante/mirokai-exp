import mongoose from "mongoose";

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Veuillez définir MONGODB_URI dans votre environnement.");
  }

  const globalWithMongoose = global as typeof globalThis & {
    mongoose?:
      | {
          conn: typeof mongoose | null;
          promise: Promise<typeof mongoose> | null;
        }
      | undefined;
  };

  if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = { conn: null, promise: null };
  }

  const cached = globalWithMongoose.mongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
