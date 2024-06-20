import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from "bcryptjs";

export const sendEmail = async ({email, emailType, userId}: any) => {
    //TODO: add usage later
    

    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verificationToken: hashedToken, verificationTokenExpiry: Date.now() + 3600000 }) 
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000 }) 
        }
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "892e05aa30bc09",
              pass: "660fe83850ebfa"
            }
          });
        const mailOptions = {
            from: 'aash@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Email Verification" : "Reset Password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
            ${emailType === "VERIFY" ? "verify your email" : "reset your password"} 
            or copy paste the link in a browser <br>
            ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            <p>`, // html body
        }
        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse
    } catch (error: any) {
        throw new Error(error.message)
    }
}