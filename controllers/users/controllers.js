import * as helpers from "./helpers.js";
import { User } from "#models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await helpers.findUser(email);
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const newUser = new User({ email, password });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({ user: { ...req.body } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email is wrong" });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const payload = { id: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        token: token,
        user: { ...req.body },
      });
    }
    return res.status(401).json({ message: "Password is wrong" });
  } catch (error) {
    next(error);
  }
};
