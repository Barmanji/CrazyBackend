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
    if (videoExists.length < 0) {
        throw new ApiError(400, "Video doesn't exist in playlist");
    }

    await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { video: videoId } }, // pull deletes the videoId in video (all occurence) Example: If playlist.video contains [vid1, vid2, vid3] and videoId = vid2, $pull will update it to [vid1, vid3].
        { new: true } // Return the updated document
    );

    return res.status(200)
    .json(new ApiResponse(200, {}, "video has been deleted successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(404, "plalist is invalid")
    }
    const playlist = await Playlist.findById(playlistId)
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }
    await Playlist.findByIdAndDelete(playlistId)
    return res.status(200)
    .json(new ApiResponse(200, null, "playlist is successfully deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "playlist is invalid")
    }
    //if([name, description].some(field => !field.trim())){
    //    throw new ApiError(400, "Name and description are required")
    //}
    const playlist = await Playlist.findById(playlistId)
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    const oldName = playlist.name;
    const oldDescription = playlist.description;
    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name || oldName,
                description: description || oldDescription
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updatePlaylist, "Playlist is updated successfully"))
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
