import express from 'express'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import loginRotes from './Login/loginRoutes.js';
import postRouter from './Post/postRoutes.js';
dotenv.config();

const app=express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database connected Successfuly");
})
.catch((error)=>{
    console.log(error.message);
});

app.use(bodyParser.json());
app.use(loginRotes)
app.use(postRouter);

app.listen(PORT,()=>{
    console.log("Server Started Successfully!!")
});