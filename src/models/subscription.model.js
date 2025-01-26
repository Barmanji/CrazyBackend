import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
   subscriber: {
        type: Schema.Types.ObjectId, //person subscribing
        ref: "User"
    },
   channel: {
        type: Schema.Types.ObjectId, //person to whom subscriber is subscibing
        ref: "User"
    }
}, {timestamps: true})

export const Subscription = mongoose.model("Subsciption", subscriptionSchema)
