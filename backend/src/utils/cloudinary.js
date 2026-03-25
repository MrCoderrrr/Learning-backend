import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { apiError } from "./apiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

const isVideoAsset = (assetPath = "") =>
  videoExtensions.includes(path.extname(assetPath).toLowerCase());

const extractPublicId = (cloudinaryUrl) => {
  const parts = cloudinaryUrl.split("/");
  const uploadIndex = parts.findIndex((part) => part === "upload");
  if (uploadIndex === -1) {
    return null;
  }

  const publicIdParts = parts.slice(uploadIndex + 1).filter(Boolean);
  if (!publicIdParts.length) {
    return null;
  }

  if (/^v\d+$/.test(publicIdParts[0])) {
    publicIdParts.shift();
  }

  const lastPart = publicIdParts[publicIdParts.length - 1] || "";
  publicIdParts[publicIdParts.length - 1] = lastPart.replace(/\.[^.]+$/, "");

  return publicIdParts.join("/");
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (!fs.existsSync(localFilePath)) {
      throw new apiError(400, "The uploaded file could not be found on the server");
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new apiError(500, "Cloudinary is not configured correctly on the server");
    }

    const isVideo = isVideoAsset(localFilePath);

    const uploader = isVideo
      ? cloudinary.uploader.upload_large.bind(cloudinary.uploader)
      : cloudinary.uploader.upload.bind(cloudinary.uploader);

    const response = await uploader(localFilePath, {
      resource_type: isVideo ? "video" : "image",
      chunk_size: isVideo ? 6 * 1024 * 1024 : undefined,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.log("CLOUDINARY ERROR:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    if (error instanceof apiError) {
      throw error;
    }

    const cloudinaryMessage =
      error?.message || error?.error?.message || error?.http_code;

    if (cloudinaryMessage) {
      throw new apiError(500, `Cloudinary upload failed: ${cloudinaryMessage}`);
    }

    throw new apiError(
      500,
      "Cloudinary upload failed. Please check your Cloudinary configuration and the selected file."
    );
  }
};

const deleteFromCloudinary = async (oldCloudinaryLink) => {
  try {
    if (!oldCloudinaryLink) {
      throw new apiError(400, "No url found");
    }

    const publicId = extractPublicId(oldCloudinaryLink);

    if (!publicId) {
      throw new apiError(400, "No valid Cloudinary public id found");
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideoAsset(oldCloudinaryLink) ? "video" : "image",
    });
    return response;
  } catch (error) {
    throw new apiError(
      400,
      "there was an error removing the image from the cloud"
    );
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
