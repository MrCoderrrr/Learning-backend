import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = { isPublished: true };

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    if (userId) {
        filter.owner = userId;
    }

    const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

    const videos = await Video.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Video.countDocuments(filter);

    return res.status(200).json(
        new apiResponse(200, { videos, total, page: parseInt(page), limit: parseInt(limit) }, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
        throw new apiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new apiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new apiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new apiError(500, "Error uploading video");
    }

    if (!thumbnail) {
        throw new apiError(500, "Error uploading thumbnail");
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new apiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId).populate("owner", "fullName username avatar");
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // increment views
    video.views += 1;
    await video.save();

    return res
        .status(200)
        .json(new apiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to update this video");
    }

    const updates = {};
    if (title?.trim()) updates.title = title;
    if (description?.trim()) updates.description = description;

    // update thumbnail if provided
    if (req.file?.path) {
        const thumbnail = await uploadOnCloudinary(req.file.path);
        if (!thumbnail) {
            throw new apiError(500, "Error uploading thumbnail");
        }
        await deleteFromCloudinary(video.thumbnail);
        updates.thumbnail = thumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updates },
        { new: true }
    );

    return res
        .status(200)
        .json(new apiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to delete this video");
    }

    await deleteFromCloudinary(video.videoFile);
    await deleteFromCloudinary(video.thumbnail);
    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not allowed to change publish status of this video");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res
        .status(200)
        .json(new apiResponse(200, { isPublished: video.isPublished }, "Publish status toggled successfully"));
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };