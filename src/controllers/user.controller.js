import{asyncHandler} from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken';


const generateAccessTokenAndRefereshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken  = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch (error){
        throw new apiError(500,"Token not Generated")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    //get user details from frontend
    const {fullName, email, username, password} = req.body
    console.log("email: ", email);
    
    //validation - not empty

    // if(fullName === ""){
    //     throw new apiError(400,"fullName is required")
    // }
    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new apiError(400,"All fields are required");
    }

    // check if user already exist
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser){
        throw new apiError(400,"Unique Email and Username required");
    }
    //check for images and avatars
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
         coverImageLocalPath = req.files.coverImage[0].path;
    }

    // check if avatar is fetched or not
    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file required");
    }
    //upload them to cloudinary, and check avatar
    const avatar = await (uploadOnCloudinary(avatarLocalPath))
    const coverImage = await (uploadOnCloudinary(coverImageLocalPath))

    if(!avatar){
        throw new apiError(400,"Avatar life is required");
    }

    // create user object - create entry in db
    const user = await User.create({
        username:username.toLowerCase(),
        avatar: avatar.url,
        fullName,
        coverImage: coverImage?.url || "",
        email,
        password,
    })

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user response
    if(!createdUser){
        throw new apiError(500,"Server didnt register user");
    }
    //return res
    return res.status(201).json(
        new apiResponse(200,createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {
    //take data from body
    //username or email
    //find user
    //password check
    //access and refresh token
    //send cookie

    const{email, username, password} = req.body

    if(!username && !email){
        throw new apiError(400,"username or email required")

    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new apiError(400,"user not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(404,"Invalid User Credentials")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefereshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "User Logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(req.user._id,
    {
        $set:{
            refreshToken: undefined
        }
    },
    {
        new:true
    }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req,res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401,"unauthorised request")
    }

try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
    
        if(!User){
            throw new apiError(401,"invalid refresh Token")
        }
    
        if(user?.refreshToken !== incomingRefreshToken){
            throw new apiError(401,"Refresh Token expired")
        }
    
        const options = {
            httpOnly:true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessTokenAndRefereshToken(user._id)
    
        return res.status(200).cookie("accessToken", options)
        .cookie("newRefreshToken", options).json(
            new apiResponse(200,{
                acessToken, refreshToken: newRefreshToken
            },
            "access token refreshed"
        )
        )

} catch (error) {
    throw new apiError(401, error?.message || "Invalid Refresh Token" )
    
}


})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}