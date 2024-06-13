import express from "express";
import {
  addUser,
  deleteUser,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
} from "./users.controller.js";

const router = express.Router();

router.route("/").get(getUsers).post(addUser);
router.route("/:id").delete(deleteUser).put(updateUser);
router.route("/username/:username").get(getUserByUsername);
router.route("/id/:id").get(getUserById);

export default router;
