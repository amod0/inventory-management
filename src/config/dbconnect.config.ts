import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnect = async () => {
  try {
    if (!process.env.DB) {
      throw new Error(
        "Database connection string is not defined in environment variables"
      );
    }
    const conn = await mongoose.connect(process.env.DB);
    console.log(`MongoDB Connected Sucessfully on ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("an Error occured");
    }
    process.exit(1);
  }
};
