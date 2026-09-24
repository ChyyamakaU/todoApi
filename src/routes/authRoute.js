/* eslint-disable no-undef */
const express =require("express");
const {registerNew, loginUser}= require("../controllers/authController")


const router = express.Router()


router.post ("/register", registerNew)
router.post("/login", loginUser)


module.exports=router