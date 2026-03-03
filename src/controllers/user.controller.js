import{asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import{uploadOnClodinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    //get user details from frontend
    const {fullName, email, username, password} = req.body
    console.log("email: ", email);
    
    //validation - not empty

    // if(fullname === ""){
    //     throw new apiError(400,"fullname is required")
    // }
    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new apiError(400,"All fields are required")
    }

    // check if user already exist
    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new apiError(400,"Unique Email and Username required")
    }
    //check for images and avatars
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // check if avatar is fetched or not
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file required");
    }
    //upload them to cloudinary, and check avatar
    const avatar = await (uploadOnClodinary(avatarLocalPath))
    const coverImage = await (uploadOnClodinary(coverImageLocalPath))

    if(!avatar){
        throw new apiError(400,"Avatar life is required")
    }

    // create user object - create entry in db
    const user = User.create({
        username:username.toLowercase(),
        avatar: avatar.url,
        fullname,
        coverImage: coverImage.url?.url || "",
        email,
        password,
    })

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user response
    if(!createdUser){
        throw new apiError(500,"Server didnt register user")
    }
    //return res
    return res.status(201).json(
        new apiResponse(200,createdUser, "User registered successfully")
    )
})

export {registerUser}