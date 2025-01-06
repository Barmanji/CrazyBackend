import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
const registerUser = asyncHandler(async(req, res) => {
    //S.1: get data from forntend-
    //S.2: Encrypt Decrypt pass with hasings ( considering the fact that we have validated all the form input values in frontend)
    //S.3: Save in database so that if user will login in future it will help. THATS it.
    //------------------------------------------------------------------- RIGHT ONEs -------------------------------------------------
     // get user details from frontend [x]
    // validation - not empty[x]
    // check if user already exists: username, email[x]
    // check for images, check for avatar[-]
    // upload them to cloudinary, avatar[]
    // create user object - create entry in db[]
    // remove password and refresh token field from response[]
    // check for user creation[]
    // return re[]
    const {username, email, fullname, password} = req.body;
    console.log("email", email);

    if([username, email, fullname, password].some((field)=> field?.trim() === "")) {
        //read about some, advance JS code
        throw new ApiError(400,"all fields are compulsory")  //i am writing all the apierror according to the class ApiError that i made insite UTILS
    }
    //User we make by mongoose, we make make dis to help aus , and yes i am writing this in my full consiousness
    ////that we can use and apply many things to it, like findOne which helps to find a field or target read in mongooooooooose

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with this email already exists")
    }

    req.files?.avatar
}
)
export {
    registerUser,
}
