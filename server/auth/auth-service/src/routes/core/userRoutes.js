import express from "express";
import { protect } from "../../middleware/index.js";
import {
  getUsers,
  addUser,
  getUserByUsername,
  getUserById,
  updateUser,
} from "../../controllers/index.js";

const router = express.Router();

router.route("/").get(protect, getUsers).post(protect, addUser);
router.route("/:id").put(protect, updateUser);
router.route("/username/:username").get(protect, getUserByUsername);
router.route("/id/:id").get(protect, getUserById);

export const usersRoutes = router;
