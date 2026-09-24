/* eslint-disable no-undef */
const express =require("express");
const router =express.router()

const {registerNew, loginUser}= require("../controllers/authController")




router.post ("/register", registerNew)
routter.post("/login", loginUser)


module.exports=router