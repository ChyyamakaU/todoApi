/* eslint-disable no-undef */
const express = require("express");

const authenticate = require("../middleware/auth");

const {
    getTodo, addTodo, getbyId, updateTodo,  deleteid} = require("../controllers/todoController");

const todoRouter = express.Router();

todoRouter.use(authenticate);

todoRouter.post("/", addTodo);

todoRouter.get("/", getTodo);

todoRouter.get("/:id", getbyId);

todoRouter.put("/:id", updateTodo);

todoRouter.delete("/:id", deleteid);

module.exports = todoRouter;