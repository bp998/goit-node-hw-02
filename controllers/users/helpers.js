import { User } from "#models/User.js";

export const findUser = (email) => User.findOne({ email }).lean();

export const signupUser = ({ password, email }) =>
  User.create({ password, email });
