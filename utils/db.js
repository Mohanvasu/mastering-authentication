import mongoose from "mongoose";
import dotenv from "dotenv";

//export function which will help me to connect to my mongo db
dotenv.config();

const db = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Database successfully connected")
    })
    .catch((error)=>{
        console.log("Error conecting DB :",error);
    })
}

export default db;