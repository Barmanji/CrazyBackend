import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUDNAME,
    api_key: process.env.CLOUDNARY_APIKEY,
    api_secret: process.env.CLOUDNARY_APISECRET,
});
//let currentImage;
const uploadResultCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const responseCloudnary = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: 'auto' //file has beed uploaded!
            }
        )
        //this current image is not the right way!
        //currentImage = cloudinary.api.resources_by_asset_ids(localFilePath) //to give me link of file
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


const deleteFromCloudinary = async (cloudinaryFilepath) => {
  try {
    if (!cloudinaryFilepath) return null;
    const fileName = cloudinaryFilepath.split("/").pop().split(".")[0];
    const response = await cloudinary.uploader.destroy(fileName);
    return response;
  } catch (error) {
    console.log("Error while deleting file from cloudinary : ", error);
    return null;
  }
};

export {uploadResultCloudinary, deleteFromCloudinary}
