import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const config_cloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
        });

        // delete local file AFTER successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);
        return null;
    }
};

export { uploadOnCloudinary, config_cloudinary };

































/*
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import fs from 'fs'

dotenv.config({
    path: "./.env"
});

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })//file has been uploaded successully
        console.log("File is uploaded on cloudinary!!", response.url);
        return response

    } catch (error) {
        console.error("❌ Cloudinary Upload Failed:", error.message);
        return null;

    }
}


export { uploadOnCloudinary }
*/

