/* eslint-disable no-undef */
const pool = require("../db");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
    const result = await pool.query("SELECT id, name, email, created_at FROM users");

    res.status(200).json(result.rows);
};

const getUser = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT id, name, email, created_at FROM users WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(result.rows[0]);
};

const createUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
    );

    const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [fullName, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    const result = await pool.query(
        `UPDATE users
         SET name = $1, email = $2
         WHERE id = $3
         RETURNING id, name, email, created_at`,
        [fullName, email, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(result.rows[0]);
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        message: "User deleted successfully"
    });
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};