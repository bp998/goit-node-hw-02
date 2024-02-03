import { Router } from "express";
import { validateUser } from "#validators/users/JoiSchema.js";
import * as controllers from "#controllers/users/controllers.js";

const router = Router();

router.get("/", (req, res, next) => {
  res.json(res.locals);
});
router.post("/signup", validateUser, controllers.signup);
router.post("/login", validateUser, controllers.login);

export default router;
