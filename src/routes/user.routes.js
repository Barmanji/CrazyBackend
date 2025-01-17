import { Router } from "express";
import { generateAccessAndRefreshTokens, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
    //injecting middleware!! for file handling
    upload.fields([
        {
            name: "avatar", maxCount: 1
        },
        {
            name: "coverImage", maxCount: 1
        }
    ]),
    registerUser
) //confusing Syntax, ====READ ABOUT IT====

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/generateToken").get(generateAccessAndRefreshTokens)
export default router;



