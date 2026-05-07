import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    mongoose.set("strictQuery", true);

    console.log("Attempting MongoDB connection...");
    console.log("Mongo URI:", env.mongoUri);

    const connection = await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== "production",
      serverSelectionTimeoutMS: 10000
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);

    return connection;
  } catch (error) {
    console.error("MongoDB CONNECTION ERROR:");
    console.error(error);
    process.exit(1);
  }
}