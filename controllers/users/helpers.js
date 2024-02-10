import { User } from "#models/User.js";
import { uploadMiddleware, isImageAndTransform } from "#middlewares/multer.js";

export const findUser = (email) => User.findOne({ email }).lean();

export const signupUser = ({ password, email }) =>
  User.create({ password, email });

const uploadAvatar = (req) => {
  return new Promise((resolve, reject) => {
    uploadMiddleware.single("avatar")(req, {}, async (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(req.file);
      }
    });
  });
};

export const updateAvatar = async (req, user) => {
  try {
    const file = await uploadAvatar(req);
    const isImage = await isImageAndTransform(file.path, file.filename);
    if (!isImage) {
      throw new Error("File is not an image or could not be transformed");
    }
    const avatarURL = "/avatars/" + file.filename;
    await User.findByIdAndUpdate(user.id, { avatarURL });
    return avatarURL;
  } catch (err) {
    throw new Error(err.message);
  }
};
