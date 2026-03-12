import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    throw new apiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new apiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new apiError(400, "Content is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not allowed to update this tweet");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true }
  );

  return res
    .status(200)
    .json(new apiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new apiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not allowed to delete this tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
