import express from "express";

import { addUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(addUser);
//router.route("/id/:id").get(getUserById);

export default router;
