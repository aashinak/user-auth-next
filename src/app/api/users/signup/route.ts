import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(req: NextRequest) {
    
    try {
        // extracts body from user request
        const reqBody = await req.json()
        const { userName, email, password } = reqBody
        // checks whether user already exists
        const user = await User.findOne({ email })
        // if exist sends a response
        if (user) {
            return NextResponse.json({error: "User already exists"},{status: 400})
        }
        // if user dont exists then new user have to be created
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        
        //////////////////////////////////////////////////////////
        // const savedUser = await User.create({
        //     userName,
        //     email,
        //     hashedPassword
        // })
        // console.log(savedUser);
        //////////////////////////////////////////////////////////
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()        
        //////////////////////////////////////////////////////////
        // after creating user send email verification
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
        return NextResponse.json({message: "User registered successfully",success: true, savedUser})
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}