import express, { urlencoded } from "express";
import cors from "cors"
import dotenv from "dotenv"
import db from "./utils/db.js";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin : process.env.BASE_URL,
    methods : ['GET','POST','PUT','DELETE'],
    allowedHeaders : ['Content-Type', 'Authorization']
}))


app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.use("/api/v1/users",router);

db();

app.listen(port, ()=>{
    console.log("App is listening on port :",port);
})