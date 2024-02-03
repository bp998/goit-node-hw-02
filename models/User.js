import mongoose from "mongoose";
import { userSchema } from "#validators/users/MongooseSchema.js";

export const User = mongoose.model("user", userSchema, "contacts");
