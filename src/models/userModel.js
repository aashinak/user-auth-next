import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

const userSchema = new Schema({
    userName: {
        type: string,
        required: [true, "Please provide username"],
    },
    email: {
        type: string,
        required: [true, "Please provide email"],
        unique: true,
    },
    password: {
        type: string,
        required: [true, "Please provide password"]
    },
    isVerified: Boolean,
    isAdmin: Boolean,
    forgotPasswordToken: string,
    forgotPasswordExpiry: Date,
    verificationToken: string,
    verificationTokenExpiry: Date,
})

const User = mongoose.models.users || model("users", userSchema)

export default User