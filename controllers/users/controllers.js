import * as helpers from "./helpers.js";
import { User } from "#models/User.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

export const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await helpers.findUser(email);
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const newUser = new User({ email, password });
    newUser.avatarURL = gravatar.url(email, { s: "200", d: "identicon" }, true);
    await newUser.setPassword(password);
    await newUser.save();
    res
      .status(201)
      .json({ user: { ...req.body, avatarURL: newUser.avatarURL } });
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
        user: { ...req.body },
      });
    }
    return res.status(401).json({ message: "Password is wrong" });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    user.token = null;
    await user.save();
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

export const avatars = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await helpers.updateAvatar(req, user);
    const getAvatarURL = await helpers.getAvatarURL(userId);

    return res.status(200).json({
      message: "Avatar updated successfully",
      avatarURL: getAvatarURL,
    });
  } catch (error) {
    next(error);
  }
};
