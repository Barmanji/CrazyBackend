import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUDNAME,
    api_key: process.env.CLOUDNARY_APIKEY,
    api_secret: process.env.CLOUDNARY_APISECRET
});

const uploadResultCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const responseCloudnary = await cloudinary.uploader.upload(
            'localFilePath',
            {
                resource_type: 'auto' //file has beed uploaded!
            }
        )
        console.log('file is uploaded on cloudiiiiiiiiiiiiiiiinarrrrrrrrrryyyyyyyy', responseCloudnary.url, uploadResultCloudinary);
        return responseCloudnary;
    }
    catch(error) {
        console.log(error)
        fs.unlinkSync(localFilePath)
        return null
        //removes the locally saved temp file as the upload opreation got failed!
    }

}

export {uploadResultCloudinary}
