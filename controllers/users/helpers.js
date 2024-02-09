import { User } from "#models/User.js";
import { uploadMiddleware, isImageAndTransform } from "#middlewares/multer.js";

export const findUser = (email) => User.findOne({ email }).lean();

export const signupUser = ({ password, email }) =>
  User.create({ password, email });

export const updateAvatar = async (req, res, id) => {
  uploadMiddleware.single("avatar")(req, {}, async function (err) {
    if (err) {
      throw new Error(err.message);
    }
    const isImage = await isImageAndTransform(req.file.path, req.file.filename);
    if (!isImage) {
      throw new Error("File is not an image or could not be transformed");
    }

    const avatarURL = "/avatars/" + req.file.filename;
    await User.findByIdAndUpdate(id, { avatarURL });
  });
};

export const getAvatarURL = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.avatarURL;
};
