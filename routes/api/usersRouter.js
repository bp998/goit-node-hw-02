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
router.get("/current", authMiddleware, controllers.current);
router.patch("/avatars", authMiddleware, controllers.avatars);
router.post("/verify", controllers.reVerify);
router.get("/verify/:verificationToken", controllers.verify);

export default router;
