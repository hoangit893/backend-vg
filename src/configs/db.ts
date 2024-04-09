import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  console.log(config.mongo.url);
  try {
    await mongoose.connect(config.mongo.url, {
      w: "majority",
      retryWrites: true,
    });
    return "Connected to database";
  } catch (err) {
    console.log(err);
  }
};
