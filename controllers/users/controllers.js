import * as helpers from "./helpers.js";
import { User } from "#models/User.js";

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
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};
