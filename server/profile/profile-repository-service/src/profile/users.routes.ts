import express from "express";
import { getUsers } from "./users.controller";

const router = express.Router();

router.route("/").get(getUsers);

export default router;
