import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { userSchema } from "#validators/users/MongooseSchema.js";

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 5);
};

export const User = mongoose.model("user", userSchema, "users");
