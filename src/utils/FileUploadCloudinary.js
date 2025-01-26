import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUDNAME,
    api_key: process.env.CLOUDNARY_APIKEY,
    api_secret: process.env.CLOUDNARY_APISECRET,
});
let currentImage;
const uploadResultCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const responseCloudnary = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: 'auto' //file has beed uploaded!
            }
        )
        currentImage = cloudinary.api.resources_by_asset_ids(localFilePath) //to give me link of file
        //console.log('file is uploaded on cloudiiiiiiiiiiiiiiiinarrrrrrrrrryyyyyyyy', responseCloudnary.url, uploadResultCloudinary);
        fs.unlinkSync(localFilePath)
        return responseCloudnary;
    }
    catch(error) {
        console.log("Error while uploading on cloudinary: ", error);
        fs.unlinkSync(localFilePath)
        return null
        //removes the locally saved temp file as the upload opreation got failed!
    }
}

const deleteFromCloudinary = async () => {
    try {
        const responseCloudnary = await cloudinary.api.delete_resources(
            currentImage,
            {
                type: 'upload',
                resource_type: 'auto'
            }
        )
        return responseCloudnary;
    } catch(error) {
        console.log("Error while deletion from cloudinary: ", error);
        return null
    }
}

export {uploadResultCloudinary, deleteFromCloudinary}
