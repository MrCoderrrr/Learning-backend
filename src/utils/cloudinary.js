// this file is made to upload files to cloudinary and remove it from the server if it is done successfully
// importing cloudinary
import { v2 as cloudinary } from "cloudinary";
// importing inbuilt fs ( file managing ) module to control files
import fs from "fs";
import { apiError } from "./apiError.js";

// configuring cloudinary for uploading
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = (async (oldCloudinaryLink) => {
  try { 
    if(!oldCloudinaryLink){
      throw new apiError(400,"No url found")
    }
    const publicId = oldCloudinaryLink.split("/").pop().split(".")[0]

        const response = await cloudinary.uploader.destroy(publicId)
        return response

  } catch (error) {
    throw new apiError(400,"there was an error removing the image from the cloud")
  }
})

export { uploadOnCloudinary, deleteFromCloudinary };
