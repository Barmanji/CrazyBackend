import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router()

router.route("/register").post(registerUser) //confusing Syntax, ====READ ABOUT IT====

export default router;
