import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getUsers,
  addUser,
  deleteUser,
  getUserByUsername,
  getUserById,
  updateUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.route("/").get(protect, getUsers).post(protect, addUser);
router.route("/:id").delete(protect, deleteUser).put(protect, updateUser);
router.route("/username/:username").get(protect, getUserByUsername);
router.route("/id/:id").get(protect, getUserById);

export default router;
