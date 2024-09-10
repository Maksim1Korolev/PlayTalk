import express from "express";
import { getUsers, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/:id").put(protect, updateUser);

export default router;
