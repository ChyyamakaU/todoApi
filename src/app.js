/* eslint-disable no-undef */
const express = require("express");

const authRouter = require("./routes/authRoute");
const todoRouter = require("./routes/todoRoute");

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/todos", todoRouter);

module.exports = app;