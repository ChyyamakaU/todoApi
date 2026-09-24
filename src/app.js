/* eslint-disable no-undef */
const express = require("express");

const authRouter = require("./routes/authRoute");
const todoRouter = require("./routes/todoRoute");

const logger = require("./middleware/logger");
const limiter = require("./middleware/rateLimit");
const errorHandler = require("./middleware/error");

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/todos", todoRouter);


app.use(logger);

app.use(limiter);
app.use(errorHandler);


module.exports = app;