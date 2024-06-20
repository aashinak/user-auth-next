import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { email, password } = reqBody
        const user = await User.findOne({ email: email })
        // const user = await User.findOne({ email: email, isVerified: {$eq: true} })
        if (!user) {
            return NextResponse.json({error: "Invalid email"},{status: 400})
        }
        const isPassword = await bcryptjs.compare(password, user.password)
        if (!isPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 })
        }
        const payload = {
            id: user._id,
            username: user.userName,
            email: user.email
        }
        const token = await jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' })
        const response = NextResponse.json(
            { message: "User logged in successfully", success: true }, { status: 200 }
        )
        response.cookies.set("token", token, { httpOnly: true /* An HttpOnly Cookie is a tag added to a browser cookie 
            that prevents client-side scripts from accessing data */ })
        return response
        
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}