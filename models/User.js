import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { userSchema } from "#validators/users/MongooseSchema.js";

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 5);
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("user", userSchema, "users");
