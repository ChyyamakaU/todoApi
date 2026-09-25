/* eslint-disable no-undef */
const express = require("express");

const {
    registerNew,
    loginUser,
    allUsers
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerNew);

router.post("/login", loginUser);

router.get("/view", allUsers
)
module.exports = router;