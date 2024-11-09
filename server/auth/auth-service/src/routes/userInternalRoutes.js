import express from "express";

import {
  addUser,
  getUserById,
  getUserByUsername,
  isUserRegistered,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(addUser);
router.route("/isRegistered/:username").get(isUserRegistered);
//TODO:Remove
router.route("/id/:id").get(getUserById);

export default router;
