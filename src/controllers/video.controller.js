import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { upload } from "../middlewares/multer.middleware.js"
import { deleteFromCloudinary, uploadResultCloudinary } from "../utils/FileUploadCloudinary.js"

// Video o/p by postman-
//{
//    "statusCode": 200,
//    "data": {
//        "videoUpload": {
//            "asset_id": "7140916ec2f6841a57172d9be1db2545",
//            "public_id": "ufn5o1fjyejterpfjoak",
//            "version": 1737993431,
//            "version_id": "682b6e3d35a4df5a3daf941018ef08b6",
//            "signature": "70d3d3a476193c81b12c05a69a5bb878b302b2ea",
//            "width": 1920,
//            "height": 1080,
//            "format": "mp4",
//            "resource_type": "video",
//            "created_at": "2025-01-27T15:57:11Z",
//            "tags": [],
//            "pages": 0,
//            "bytes": 7527695,
//            "type": "upload",
//            "etag": "5a28faeffd03a3b40e180c48e56618f6",
//            "placeholder": false,
//            "url": "http://res.cloudinary.com/barmanji/video/upload/v1737993431/ufn5o1fjyejterpfjoak.mp4",
//            "secure_url": "https://res.cloudinary.com/barmanji/video/upload/v1737993431/ufn5o1fjyejterpfjoak.mp4",
//            "playback_url": "https://res.cloudinary.com/barmanji/video/upload/sp_auto/v1737993431/ufn5o1fjyejterpfjoak.m3u8",
//            "asset_folder": "",
//            "display_name": "ufn5o1fjyejterpfjoak",
//            "audio": {
//                "codec": "aac",
//                "bit_rate": "160993",
//                "frequency": 48000,
//                "channels": 2,
//                "channel_layout": "stereo"
//            },
//            "video": {
//                "pix_format": "yuv420p",
//                "codec": "h264",
//                "level": 42,
//                "profile": "High",
//                "bit_rate": "14632967",
//                "dar": "16:9",
//                "time_base": "1/15360"
//            },
//            "is_audio": false,
//            "frame_rate": 60,
//            "bit_rate": 14808579,
//            "duration": 4.066667,
//            "rotation": 0,
//            "original_filename": "sampullll",
//            "nb_frames": 244,
//            "api_key": "248182751377864"
//        },
//        "thumbnailUpload": {
//            "asset_id": "1c8117a6c7158cc7737e79eda564226a",
//            "public_id": "in9kbiicdjfifmgeoey1",
//            "version": 1737993452,
//            "version_id": "60c37a775270d26d0c32f05c27374c3d",
//            "signature": "83ca60a630fc5b8d1dfe5a2c03cf29c98af21277",
//            "width": 5376,
//            "height": 3072,
//            "format": "jpg",
//            "resource_type": "image",
//            "created_at": "2025-01-27T15:57:32Z",
//            "tags": [],
//            "bytes": 7135593,
//            "type": "upload",
//            "etag": "3ee4f8b2b2528fa32d6ebbdb1b44784b",
//            "placeholder": false,
//            "url": "http://res.cloudinary.com/barmanji/image/upload/v1737993452/in9kbiicdjfifmgeoey1.jpg",
//            "secure_url": "https://res.cloudinary.com/barmanji/image/upload/v1737993452/in9kbiicdjfifmgeoey1.jpg",
//            "asset_folder": "",
//            "display_name": "in9kbiicdjfifmgeoey1",
//            "original_filename": "4c849aae-8399-4906-8510-a5d522cc270c",
//            "api_key": "248182751377864"
//        },
//        "videofile": [
//            {
//                "fieldname": "videoFile",
//                "originalname": "sampullll.mp4",
//                "encoding": "7bit",
//                "mimetype": "video/mp4",
//                "destination": "./public/temp",
//                "filename": "sampullll.mp4",
//                "path": "public/temp/sampullll.mp4",
//                "size": 7527695
//            }
//        ],
//        "allFiles": {
//            "thumbnail": [
//                {
//                    "fieldname": "thumbnail",
//                    "originalname": "4c849aae-8399-4906-8510-a5d522cc270c.jpg",
//                    "encoding": "7bit",
//                    "mimetype": "image/jpeg",
//                    "destination": "./public/temp",
//                    "filename": "4c849aae-8399-4906-8510-a5d522cc270c.jpg",
//                    "path": "public/temp/4c849aae-8399-4906-8510-a5d522cc270c.jpg",
//                    "size": 7135593
//                }
//            ],
//            "videoFile": [
//                {
//                    "fieldname": "videoFile",
//                    "originalname": "sampullll.mp4",
//                    "encoding": "7bit",
//                    "mimetype": "video/mp4",
//                    "destination": "./public/temp",
//                    "filename": "sampullll.mp4",
//                    "path": "public/temp/sampullll.mp4",
//                    "size": 7527695
//                }
//            ]
//        }
//    },
//    "message": "Video uploaded succesfully",
//    "success": true
//}
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if ([title, description].some((field)=>!field.trim())){
        throw new ApiError(400, "Title and Description cannot be empty")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path; //technically req.files returns array
    if(!videoLocalPath){
        throw new ApiError(400, "Video is necessary")
    }
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(404, "Thumbnail not found")
    }

    const videoUpload = await uploadResultCloudinary(videoLocalPath);
    if(!videoUpload?.url){
        throw new ApiError(404, "There is an issue with uploading video")
    }
    const thumbnailUpload = await uploadResultCloudinary(thumbnailLocalPath);
    if(!thumbnailUpload?.url){
        throw new ApiError(404, "Thumbnail hasn't uploaded, there is some error with cloudinary")
    }
//const duration = videoUpload.duration

    const video = await Video.create({
        title: title,
        duration: videoUpload.duration,
        description: description,
        videoFile: videoUpload?.url,
        thumbnail: thumbnailUpload?.url,
        owner: req.user._id,
    })
    if (!video) {
        throw new ApiError(500, "Error occurred while saving the video to the database");
    }

    return res.status(201)
    .json(new ApiResponse(200, video, "Video uploaded succesfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {newTitle, newDescription} = req.body;
    if([newTitle, newDescription].some(fields => !fields.trim())){
        throw new ApiError(400, "New description and title cant be empty")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }
    const oldThumbnail = video.thumbnail; //try to delete thumbnail afterwards because what if user didnt upload thumbnail
    if(!oldThumbnail){
        throw new ApiError(400, "oldThumbnail cant be found")
    }
    oldThumbnail && (await deleteFromCloudinary(oldThumbnail))

    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(404, "Thumbnail not found");
    }
    const thumbnailUpload = await uploadResultCloudinary(thumbnailLocalPath);
    if(!thumbnailUpload?.url){
        throw new ApiError(404, "Thumbnail hasn't uploaded, there is some error with cloudinary")
    }

    const updateVideoFields = await Video.findByIdAndUpdate(
        req.params.videoId, {
            $set: {
                thumbnail: thumbnailUpload.url,
                title: newTitle, //if user hasnt given any value then default original title will be set, same for desc.
                description: newDescription
            }
        }, {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updateVideoFields, "Video updated succesfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }


    const deleteVideo = await deleteFromCloudinary(video.videoFile)
    const deleteThumbnail = await deleteFromCloudinary(video.thumbnail)
    const deleteFromDatabase = await Video.findByIdAndDelete(videoId);
    res.status(200)
        .json(new ApiResponse(200, {}, "Video is deleted succesfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(req.params.videoId);
    if (!video){
        throw new ApiError(400, "Video cant be found")
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }
    const modifyVideoPublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished,
            },
        },
        { new: true }
    );
    res.status(200)
        .json(new ApiResponse(200, modifyVideoPublishStatus, "video"))


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
