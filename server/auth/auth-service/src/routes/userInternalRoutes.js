import express from "express";
import {
  addUser,
  getUserById,
  getUserByUsername,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(addUser);
router.route("/username/:username").get(getUserByUsername);
router.route("/id/:id").get(getUserById);

export default router;
