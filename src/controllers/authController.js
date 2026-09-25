
/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = require("../../database/user");

const allUsers = async (req, res) => {

    console.log(users)
    return res.status(200).json({
        "viewAll": users
    })
}


const registerNew = async (req, res) => {

    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({
            status: "error",
            message: "All fields are required"
        });
    }

    const existingUser = users.find(
        (user) => user.email === email
    );

    if (existingUser) {
        return res.status(409).json({
            status: "error",
            message: "This email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
    );

    const newUser = {
        id: users.length + 1,
        fullName,
        email,
        phone,
        password: hashedPassword
    };

    users.push(newUser);

    return res.status(201).json({
        status: "successful",
        message: "You have registered successfully"
    });

}
    ;


const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required"
        });
    }

    const existingUser = users.find(
        (user) => user.email === email
    );

    if (!existingUser) {
        return res.status(401).json({
            status: "error",
            message: "Invalid email or password"
        });
    }

    const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
    );

    if (!passwordMatch) {
        return res.status(401).json({
            status: "error",
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: existingUser.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return res.status(200).json({
        status: "successful",
        message: "You have been successfully logged in",
        token
    });

};


module.exports = {
    allUsers,
    registerNew,
    loginUser
};