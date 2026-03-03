// this file is made to upload files to cloudinary and remove it from the server if it is done successfully
// importing cloudinary
import {v2 as cloudinary} from "cloudinary";
// importing inbuilt fs ( file managing ) module to control files
import fs from fs;

// configuring cloudinary for uploading 
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET  
});
  