import Express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDataModel } from "./userModel.js";
import * as dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

dotenv.config();
const loginRotes = Express.Router();
let message = "";

loginRotes.post('/register',[
    body('Email').trim().escape(),
    body('Password').trim().escape()
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.send("Missing fields");
    }
    const passwordHashed = await bcrypt.hash(Password, 15);
    const user = new userDataModel({ Email, Password: passwordHashed });
    await user.save()
        .then((response) => {
            res.status(201).send("User Added Successfully!!");
        })
        .catch((e) => {
            if (e.code == 11000) {
                message = "Email address already exist";
            }
            else {
                message = String(e)
            }
            res.status(e.code).send(message);
            console.log(e)
        });
})

loginRotes.post("/login", async (req, res) => {
    const { Email, Password } = req.body;
    
    try {
        const user = await userDataModel.findOne({ Email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }
        const isPasswordValid = bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials');
        }
        const payload={
            userId:user._id,
            username:user.Email
        }
        const token = jwt.sign(payload, process.env.JWT_SECERT_KEY);
        res.status(201).send({message:"Login Successful!!",token:token});
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Error in Authenticating user\n Please Try again Later');
    }
})

export default loginRotes;
