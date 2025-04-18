import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
        name : {
            type : String,
            required: true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true,
            trim : true,
            min : 8,
            max : 16
        },
        isVerified : {
            type : Boolean,
            default : false
        },
        role : {
            type : String,
            enum : ["user","admin"],
            default : "user"
        },
        verificationToken : String,
        verificationTokenExpiry : Date
    },{
        timestamps : true
});

userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password =  await bcrypt.hash(this.password,10);
        console.log(`hashed password : ${this.password}`);
    }
    next();
});

userSchema.methods.comparePassword =  async (password,userPassword)=>{
    return await bcrypt.compare(password,userPassword);
}

const User = mongoose.model("User",userSchema);
export default User;