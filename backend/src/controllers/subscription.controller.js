import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (channelId.toString() === req.user._id.toString()) {
    throw new apiError(400, "You cannot subscribe to your own channel");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new apiError(404, "Channel not found");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new apiResponse(200, {}, "Unsubscribed successfully"));
  }

  await Subscription.create({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Subscribed successfully"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "fullName username avatar"
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const channels = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "fullName username avatar");

  return res
    .status(200)
    .json(
      new apiResponse(200, channels, "Subscribed channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
