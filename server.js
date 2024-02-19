import app from "./app.js";
import mongsoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST: uriDb } = process.env;

const PORT = 3001;

const connection = mongsoose.connect(uriDb);

export const startServer = async () => {
  try {
    await connection;
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (err) {
    console.log("db not connected");
    process.exit(1);
  }
};
