import express from "express";
import {
  getUsers,
  addUser,
  getUserByUsername,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers).post(addUser);
router.route("/:id").put(updateUser);
router.route("/username/:username").get(getUserByUsername);
router.route("/id/:id").get(getUserById);

export default router;
