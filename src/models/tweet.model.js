import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
},{timestamps: true})

export const Tweet = mongoose.model("Tweet", tweetSchema)
