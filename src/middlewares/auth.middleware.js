import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

try {
    const VerifyExistenceOfUserByJWT = asyncHandler( async(req, res, next) => {
    //cookies?. is becuase movile donest store cookies thats why do that always
    const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") //this gives me access of all cookies as i have acess it cia cookie parser ini index js, bearer ko replace kro empty str
    })

    if(!token) {
        throw new ApiError(401, "Unautharized Request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}

export default existenceOfUser;
