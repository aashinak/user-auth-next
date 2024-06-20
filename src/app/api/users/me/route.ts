import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'


connect()

export async function GET(req: NextRequest) {
    
    try {
        const userId = await getDataFromToken(req)        
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return NextResponse.json({error: "User not found"},{status: 400})
        }
        return NextResponse.json({message: "User found", data: user},{status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}