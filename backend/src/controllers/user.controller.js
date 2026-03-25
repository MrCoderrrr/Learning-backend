import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const clearAuthCookies = (res) =>
  res.clearCookie("accessToken", authCookieOptions).clearCookie("refreshToken", authCookieOptions);

const generateAccessTokenAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Token not Generated");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("hello");
  const { fullName, email, username, password } = req.body;  
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username.toLowerCase();

  const existedUser = await User.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });
  if (existedUser) {
    throw new apiError(400, "Unique Email and Username required");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    username: normalizedUsername,
    avatar: avatar.url,
    fullName,
    coverImage: coverImage?.url || "",
    email: normalizedEmail,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Server didnt register user");
  }

  console.log("User Created");
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new apiError(400, "username or email required");
  }

  const normalizedEmail = email?.toLowerCase();
  const normalizedUsername = username?.toLowerCase();

  const user = await User.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });

  if (!user) {
    throw new apiError(404, "Account not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Wrong password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefereshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  return clearAuthCookies(res)
    .status(200)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "unauthorised request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "invalid refresh Token");
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new apiError(401, "Refresh Token expired");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefereshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, authCookieOptions)
      .cookie("refreshToken", newRefreshToken, authCookieOptions)
      .json(
        new apiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiError(401, "old password is wrong");
  }

  if (newPassword !== confirmPassword) {
    throw new apiError(400, "new password and confirmed password do not match");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new apiResponse(200, req.user, "user found!!!"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username, description = "" } = req.body;
  if (!fullName || !email || !username) {
    throw new apiError(400, "all fields are required");
  }

  const existingUser = await User.findOne({
    $or: [
      { username: username.toLowerCase() },
      { email: email.toLowerCase() },
    ],
    _id: { $ne: req.user?._id },
  });

  if (existingUser) {
    throw new apiError(400, "username or email already exists");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        description,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "account details are changed"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "new Avatar not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new apiError(400, "Error in uploading avatar");
  }

  const oldAvatarUrl = req.user?.avatar;
  if (oldAvatarUrl) {
    await deleteFromCloudinary(oldAvatarUrl);
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new apiError(400, "new cover image  not found");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image.url) {
    throw new apiError(400, "Error in uploading avatar");
  }

  const oldCoverImageUrl = req.user?.coverImage;
  if (oldCoverImageUrl) {
    await deleteFromCloudinary(oldCoverImageUrl);
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: image.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new apiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        username: 1,
        description: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user[0]?.watchHistory ?? [],
        "Watch history fetched successfully"
      )
    );
});

export {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
};
