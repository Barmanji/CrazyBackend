import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { uploadResultCloudinary } from "../utils/FileUploadCloudinary.js"


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

    const videoLocalPath = req.files?.videoFile[0]?.path;
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

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload?.url || "",
        thumbnail: thumbnailUpload?.url || ""
    })
    if (!video) {
        throw new ApiError(500, "Error occurred while saving the video to the database");
    }

    const uploadedVideo = await Video.findById(video?._id)
    if(!uploadedVideo){
        throw new ApiError(400, "Error with uploading video")
    }

    return res.status(201)
    .json(new ApiResponse(200, {uploadedVideo}, "Video uploaded succesfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title, description} = req.body;
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is missing")
    }
    const uploadThumbnail = await uploadResultCloudinary(thumbnailLocalPath);
    if (!uploadThumbnail){
        throw new ApiError(400, "Error uploading thumbnail")
    }

    const updateVideoFields = await Video.findOneAndUpdate(
        req.video?._id, {
            $set: {
                thumbnail: thumbnail.url,
                title: title,
                description, description
            }
        }
    )
    return res.status(200)
    .json(new ApiResponse(200, updateVideoFields, "Video updated succesfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
