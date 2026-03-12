import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "./apiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(500, "Failed to upload file to cloudinary");
    return null;
  }
};

const deleteFromCloudinary = async (oldCloudinaryLink) => {
  try {
    if (!oldCloudinaryLink) {
      throw new apiError(400, "No url found");
    }
    const publicId = oldCloudinaryLink.split("/").pop().split(".")[0];

    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    throw new apiError(
      400,
      "there was an error removing the image from the cloud"
    );
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
