/* eslint-disable no-undef */
const express = require ("express")
const router =require("./routes/authRoute")

const app = express()
app.use(express.json()) 

app.use("/user", router)


module.exports=app