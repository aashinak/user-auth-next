import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json()
        const { userName, email, password } = reqBody
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({error: "User already exists"},{status: 400})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        //////////////////////////////////////////////////////////
        const savedUser = await User.create({
            userName,
            email,
            hashedPassword
        })
        console.log(savedUser);
        //////////////////////////////////////////////////////////
        // const newUser = new User({
        //     userName,
        //     email,
        //     hashedPassword
        // })
        // const save = await newUser.save()
        //////////////////////////////////////////////////////////
        // send email verification
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
        return NextResponse.json({message: "User registered successfully",success: true, savedUser})
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}