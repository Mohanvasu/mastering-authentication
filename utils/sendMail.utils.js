import nodemailer from "nodemailer"

//create transport 
//mailOptions
//send mail
// we can use nodemailer, it allows us to send emails from our Node.js application using a simple and intuitive API
const sendVerificationEmail = async(email,token)=>{
    console.log("Sending verification email to : ",email);
    try {
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port : process.env.MAILTRAP_PORT,
            secure : process.env.secure === "true",
            auth : {
                user : process.env.MAILTRAP_USERNAME,
                pass : process.env.MAILTRAP_PASSWORD
            }
        });
        //verification URL
        const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;

        //email content
        const mailOptions = {
            from : `"Authentication App <${process.env.SENDER_MAIL}>"`,
            to : email,
            subject : "Please verify your email address",
            text : `
            Thank you for registering ! Please verify your email address to complete your registration.
            ${verificationUrl}
            This verification link will expire in 10 mins.
            If you didn't create this account, please ignore this email address.
            `
        }

        //send email

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent : %s",info.messageId);
        return true;
    } catch (error) {
        console.error("Error occurred while sending verification email: ",error);
        return false;
    }
}

export default {sendVerificationEmail};