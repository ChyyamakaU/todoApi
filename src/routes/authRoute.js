/* eslint-disable no-undef */
const express =require("express");
const {registerNew, loginUser}= require("../controllers/authController")


const authRouter = express.Router()


authRouter.post ("/register", registerNew)
authRouter.post("/login", loginUser)


module.exports=authRouter