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
    const token = await newUser.setVerificationToken();
    const verifyEmail = await helpers.sendVerificationEmail(email, token);
    if (!verifyEmail) {
      return res.status(400).json({ message: "Problem with sending email" });
    }
    await newUser.save();
    res.status(201).json({
      message: "Verification email sent",
      user: { ...req.body, avatarURL: newUser.avatarURL },
    });
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
    if (user.verify === false) {
      return res.status(401).json({ message: "Please verify your email" });
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
    const getAvatarURL = await helpers.updateAvatar(req, user);
    if (getAvatarURL) {
      return res.status(200).json({
        message: "Avatar updated successfully",
        avatarURL: getAvatarURL,
      });
    }
    return res.status(400).json({ message: "Problem with updating avatar" });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.verificationToken,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.verificationToken = "done";
    user.verify = true;
    await user.save();
    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const reVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({ email });
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const token = await user.setVerificationToken();
    const verifyEmail = await helpers.sendVerificationEmail(email, token);
    if (!verifyEmail) {
      return res.status(400).json({ message: "Problem with sending email" });
    }
    await user.save();
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
