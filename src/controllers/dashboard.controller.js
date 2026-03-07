import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  const videos = await Video.find({ owner: userId });

  const totalVideos = videos.length;

  const totalViews = videos.reduce((acc, video) => acc + video.views, 0);

  const videoIds = videos.map((video) => video._id);

  const totalLikes = await Like.countDocuments({
    video: { $in: videoIds },
  });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalSubscribers,
        totalVideos,
        totalViews,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new apiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
