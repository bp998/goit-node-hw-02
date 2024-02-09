import Joi from "joi";

const docSchema = Joi.object({
  password: Joi.string().min(3).max(25).required("Password is required"),
  email: Joi.string().email().required("Email is required"),
  subscryption: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string().default(null),
  avatarURL: Joi.string(),
});

export const validateUser = (req, res, next) => {
  const { error } = docSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
