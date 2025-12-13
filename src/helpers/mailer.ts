import bcrypt from "bcryptjs";
import User from "@/models/usermodel";
import nodemailer from 'nodemailer';

export const sendEmail = async({email, emailType, userId} : any) => {
    try {
        // create a hash token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry : Date.now() + 3600000
            });
        }
        else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry : Date.now() + 3600000
        });
        }
        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        }
        });
        const mailOptions = {
            from : process.env.FROM_EMAIL,
            to : email,
            subject : emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html : `<p>Click <a href="${process.env.CLIENT_URL}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p> or copy and paste this link in your browser: ${process.env.CLIENT_URL}/verifyemail?token=${hashedToken}`,
        }
        const mailResponse = await transport.sendMail(mailOptions);
        console.log("Mail sent to ", email);
        return mailResponse;
    } catch (error : any) {
        throw new Error(error.message)
    }
}