//register controller
import User from "../models/user.models.js";
import bcrypt from "bcryptjs"
import crypto from "crypto"
import sendMail from "../utils/sendMail.utils.js"
import { send } from "process";
import jwt from "jsonwebtoken";

const register = async(req,res) =>{
    //get user data from req body
    const {name,email,password} = req.body;

    //validate data
    if(!email || !password || !name){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        });
    }

    if(password.length < 8){
        res.status(400).json({
            success : false,
            message : "Password must be at least 8 characters"
        })
    }
    try {
        //check if user already exists
        const user = await User.findOne({email});
        if(user){
            console.log(`User already exists, ${user.name} and ${user.id} and ${user.email}`);
            return res.status(400).json({
                success: false,
                message : "User already exists"
            })
        }else{
            console.log("User not found, creating user ....");
        }
        // 2. Create user verfication token
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 10 * 60 * 1000;

        try {
            const newUser = await User.create({
                name,
                email,
                password,
                verificationToken : token,
                verificationTokenExpiry : tokenExpiry
            })
            if(!newUser){
                res.status(200).json({
                    success: false,
                    message : "User not created"
                })
            }
            console.log(`User created successfully`);
        } catch (error) {
            console.log(`Error create new user : ${error}`);
        }


        console.log("User successfully saved !")

        //send mail
        const result = await sendMail.sendVerificationEmail(email,token);

        if(!result){
            return res.status(200).json({
                success : false,
                message : "Unable to send verification email"
            });
        }

        //response to user

        return res.status(200).json({
            success : true,
            message : "User registered successfully, now please proceed for email verification"
        });
    } catch (error) {
        console.log("Unable to save user : ",error);
        return res.status(200).json({
            success : false,
            message : "Internal server error"
        });
    }

}

const verify = async (req,res)=>{
    try {
        //1. get token from params
        const token = req.params.token;

        //get user 
        const user = await User.findOne({
            verificationToken : token,
            verificationTokenExpiry : {$gt : Date.now()} 
        })

        //does user exist
        if(!user){
            return res.status(200).json({
                success : false,
                message : "token invalid"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        console.log(`Is user verified : ${user.isVerified}`);

        await user.save();

        return res.status(200).json({
            success : true,
            message : "User verified successfully"
        });
    } catch (error) {
        return res.status(200).json({
            success : false,
            message : "Internal server error"
        })
    }
}

const login = async (req,res)=>{
    //1. get user data from req body
    const {email,password} = req.body;

    //2. validate

    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }

    try {
        const user = await User.findOne({email : email});
        if(!user){
            return res.status(500).json({
                success : false,
                message : "User not found"
            });
        }
        if(!user.isVerified){
            return res.status(400).json({
                success : false,
                message : "User not verified"
            })
        }
        //check password
        const isPasswordValid = await bcrypt.compare(password,user.password); //or const isPasswordValid = await user.comparePassword.call(user, password);
        console.log(`isPasswordValid : ${isPasswordValid}`);
        if(!isPasswordValid){
            return res.status(200).json({
                success : false,
                message : "Password is incorrect"
            })
        }
        

        //jwt token
        const jwtToken = jwt.sign({id : user.id},process.env.JWT_SECRET,{
            expiresIn : 15
        })

        //set cookie
        const cookieOptions = {
            expires : new Date(Date.now() + 24*60*60*1000),
            httpOnly : true
        }

        res.cookie("jwtToken",jwtToken,cookieOptions);

        return res.status(200).json({
            success : true,
            message : "User logged in successfully"
        })
    } catch (error) {
        console.log("Unable to login user : ",error);
        res.status(200).json({
            success : false,
            message : "Unable to login user"
        })
    }
}

export {register,verify,login};