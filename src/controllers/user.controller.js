import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadResultCloudinary } from "../utils/FileUploadCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cookieParser from "cookie-parser";

//--------------------------- Generally a good idea to make a method for----------------------------//
//                            accesstoken and refresh, becusae we have to
//                            use to alot

const generateAccessAndRefreshTokens = async(userID) => {
    try {
        const user = await User.findOne(userID)
        const refreshToken = user.generateRefreshToken()
        const acessToken = user.generateAccessToken()

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave})

        return {acessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something wrong happened while generating AccessAndRefreshTokens")
    }
}
const registerUser = asyncHandler(async(req, res) => {
    //S.1: get data from forntend-
    //S.2: Encrypt Decrypt pass with hasings ( considering the fact that we have validated all the form input values in frontend)
    //S.3: Save in database so that if user will login in future it will help. THATS it.
    //------------------------------------------------------------------- RIGHT ONEs -------------------------------------------------
     // get user details from frontend [x]
    // validation - not empty[x]
    // check if user already exists: username, email[x]
    // check for images, check for avatar[x]
    // upload them to cloudinary, avatar[x]
    // create user object - create entry in db[x]
    // remove password and refresh token field from response[x]
    // check for user creation[]
    // return re[]
    const {username, email, fullname, password} = req.body;
    //console.log("email", email);

    if([username, email, fullname, password].some((field)=> field?.trim() === "")) {
        //read about some, advance JS code
        throw new ApiError(400,"all fields are compulsory")  //i am writing all the apierror according to the class ApiError that i made insite UTILS
    }
    /*
    User we make by mongoose, we make make dis to help aus , and yes i am writing this in my full consiousness
    that we can use and apply many things to it, like findOne which helps to find a field or target read in mongooooooooose
    ========================== ASSIGNMNET = Console.log everything, FIGURE IT OUT! ==========================================
    */
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    });

    if (existedUser) { // retuns true then;
        throw new ApiError(409, "User with this email already exists")
    };

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path; //[0] is for first property
       let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is necessary")
    }
    const avatarUpload = await uploadResultCloudinary(avatarLocalPath);
    const converImageUpload = await uploadResultCloudinary(coverImageLocalPath);
    if (!avatarUpload) {
        throw new ApiError(400, "Avatar image is very necessary")
    }

    console.log("tera dhiyan kidhar hai?",req.files)

    const user = await User.create({
        fullname,
        avatar: avatarUpload.url,
        coverImage: coverImageLocalPath?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
//READ ABOUT USER.findbyid, by ._id
    const createdUser = await User.findById(user._id).select("-password -refreshToken")  //- sign means discard it " " means
    if (!createdUser) throw new ApiError(500, "Error with registering user, We are trying to fix it!")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered succesfully")
    )}
)
//------------------------------ LOGIN USER --------------------------------//
 // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
const loginUser = asyncHandler(async(req, res) => {
    const {email, username, password} = req.body;
    if(!username || !email) {
        throw new ApiError(400, "Atleast one of the field is required -> Email or Username")
    }

    //User.findOne({email}) --> this is valid as wellfor email only or for username just change it to username
    const findUser = await User.findOne({
        $or: [{email}, {username}] //better syntax
    })

    if(!findUser) {
        throw new ApiError(404, "This user doesn't exist with this email or username")
    }

    const passwordValidity = await findUser.isPasswordCorrect(password)
        if(!passwordValidity) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {refreshToken, acessToken} = await generateAccessAndRefreshTokens(findUser._id)
    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken") //little optional
    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accesstoken", acessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                findUser: loggedInUser, acessToken, refreshToken
            }, "User logged in succesfully")
        )
})

//-------------------------------- LOGOUT USER --------------------------------------//
//Assignment-
//s1: check if user is login or not only then we can logout, i.e. check if loginUser returns 200 code.
//s2: clear cookies and refresh tokens from user model
    const logoutUser = asyncHandler( async(req, res) => {
})

export {
    registerUser, loginUser
}
