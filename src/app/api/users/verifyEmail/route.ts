import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(req: NextRequest) {
    try {
        // get token from request body
        const reqBody = await req.json()
        const { token } = reqBody
        // check if a user exist with the token and within time of expiry
        const user = await User.findOne(
            { verificationToken: token, verificationTokenExpiry: { $gt: Date.now() } }
        )
        // if no user found then it is inavlid token
        if (!user) {
            return NextResponse.json({error: "Invalid token"},{status: 400})
        }
        // if there is a user set verification true and some clean up then save the updated user info
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiry = undefined
        await user.save()
        return NextResponse.json({ message: "Email verified successfully", success: true },
            { status: 200 })
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}