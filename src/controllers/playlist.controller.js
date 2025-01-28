import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    //TODO: create playlist
    if([name, description].some(field => !field.trim())){
        throw new ApiError(400, "Name and description are required")
    }
    const sameNamesNotAllowedForSinglePerson = await Playlist.findOne({
        $and: [{
            name: { $regex: `^${req.body.name}$`, $options: "i" } //This ensures an exact match of the playlist name, not just partial matches.
        },//^: Ensures the match starts at the beginning of the string. ${req.body.name}: Dynamically inserts the playlist name provided by the user.
            //$: Ensures the match ends at the end of the string.
            {
                owner: req.user._id
            }] //option i is for insensitive case
    });
    if(sameNamesNotAllowedForSinglePerson){
        throw new ApiError(401, "Same named playlist are now allowed")
    }
    const playlist = await Playlist.create({
        name: name,
        description: description,
        owner: req.user?._id // i Want each playlist to have its own owner
    })
    if(!playlist){
        throw new ApiError(404,"playlist is not found")
    }
    return res.status(200)
        .json(new ApiResponse(200, {sameNamesNotAllowedForSinglePerson, playlist}, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    if([playlistId, videoId].some(field => !field.trim())){
        throw new ApiError(400, "Playlist and Video are must")
    }
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Playlist or Video ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "No Playlist found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }
    const videoExists = playlist.video.filter(
        (video) => video.toString() === videoId
    );
    if (videoExists.length > 0) {
        throw new ApiError(400, "Video already in the Playlist");
    }

    const videoAdd = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet : {
                video: videoId
            }
        },
        {new: true}
    )
    return res.status(200)
        .json(new ApiResponse(200,  videoAdd, "Video is successfully added"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
