import { databaseConfigurations } from "app/config";
import mongoose from "mongoose";

export default async function databaseConnection() {
  try {
    const DB_URL = databaseConfigurations.DB_URL;
    console.log("DB_URL", DB_URL);
    await mongoose.connect(DB_URL);
    console.log("Database connected");
  } catch (error: Error | any) {
    console.log("Error ============");
    console.log(error.message);
    process.exit(1);
  }
}
