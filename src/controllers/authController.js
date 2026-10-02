/* eslint-disable no-undef */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const registerNew = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Full name, email and password are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "This email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            Number(process.env.SALT_ROUNDS)
        );

        await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            [fullName, email, hashedPassword]
        );

        return res.status(201).json({
            status: "successful",
            message: "You have registered successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Something went wrong"
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        const existingUser = result.rows[0];

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

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: "error",
            message: "Something went wrong"
        });
    }
};


module.exports = {
    registerNew,
    loginUser
};