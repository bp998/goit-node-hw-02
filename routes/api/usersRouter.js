import { Router } from "express";
// import {
//   validateContact,
//   validateFavorite,
// } from "#validators/contacts/JoiSchema.js";

import * as controllers from "#controllers/users/controllers.js";

const router = Router();

router.post("/signup", controllers.signup);

export default router;
