import express from "express";
import { getUsers, addUser, deleteUser } from "./users.controller.js";

const router = express.Router();

router.route("/").get(getUsers).post(addUser);
router.route("/:id").delete(deleteUser);

export default router;
