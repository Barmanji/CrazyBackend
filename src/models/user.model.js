import { JsonWebTokenError } from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true //whenever we need to search somsethiing its best adviced to enable the index tag in schema!!
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudnary something something like AWS for url ()FREEE() read about it!
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video" //always write ref after schema type
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required'] //with all true field we can pass in arry for default values
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

//dont write callback like() => {} in .pre because we dont have .this fucnatiolity. READ MORE ABOUT!!! ###a
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
export const User = mongoose.model("User, userSchema")
