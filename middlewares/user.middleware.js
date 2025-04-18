//isLoggedIn middleware

import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

const isLoggedIn =  async (req,res,next)=>{
    //get token from cookies
    const token =  req.cookies.jwtToken;
        if(!token){
            return res.status(401).json({
                success : false,
                message : "User not logged in"
            })
        }
    try {
        //verify if token is valid or not
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.decodedToken = decodedToken;
        const userId = decodedToken.id;

        const user = User.findOne({userId}).select("-password");
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User not logged in"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Internal server error :",error)
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export default isLoggedIn;