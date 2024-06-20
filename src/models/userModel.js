import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "Please provide username"],
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },
    isVerified: Boolean,
    isAdmin: Boolean,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
})

const User = mongoose.models.users || model("users", userSchema)

export default User