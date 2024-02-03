import { Router } from "express";
import { validateUser } from "#validators/users/JoiSchema.js";
import * as controllers from "#controllers/users/controllers.js";
import authMiddleware from "#middlewares/jwt.js";

const router = Router();

router.get("/", authMiddleware, (req, res, next) => {
  res.json(res.locals);
});
router.post("/signup", validateUser, controllers.signup);
router.post("/login", validateUser, controllers.login);
router.get("/logout", authMiddleware, controllers.logout);

export default router;
