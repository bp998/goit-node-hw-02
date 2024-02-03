import Joi from "joi";

const docSchema = Joi.object({
  password: Joi.string().required("Password is required"),
  email: Joi.string().required("Email is required"),
  subscryption: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string().default(null),
});

export const validateUser = (req, res, next) => {
  const { error } = docSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
