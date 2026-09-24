/* eslint-disable no-undef */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const bankUsers = require("../data");

const registerNew = async (req, res) => {

    const { fullName, email, phone, password, role } = req.body;

    const existingUser = bankUsers.find(
        user => user.email === email
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
        id: bankUsers.length + 1,
        fullName,
        email,
        phone,
        password: hashedPassword,
        balance: 0,
        accountNumber: String(1000000000 + bankUsers.length + 1),
        role
    };

    bankUsers.push(newUser);

    console.log(bankUsers);

    return res.status(201).json({
        status: "successful",
        message: "You have registered successfully"
    });
};


const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const existingUser = bankUsers.find(
        user => user.email === email
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
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role
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
    registerNew,
    loginUser
};