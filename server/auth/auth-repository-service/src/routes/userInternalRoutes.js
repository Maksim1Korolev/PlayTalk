import express from "express";
import { addUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(addUser);
router.route("/id/:id").get(getUserById);
router.route("/:id").put(updateUser);

export default router;
