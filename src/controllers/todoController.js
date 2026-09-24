
/* eslint-disable no-undef */

let db = require("../../database/todo");

const addTodo = (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({
            status: "error",
            message: "Title is required"
        });
    }

    const newTodo = {
        id: db.length + 1,
        title,
        description,
        completed: false,
        userId: req.user.id,
        createdAt: new Date()
    };

    db.push(newTodo);

    return res.status(201).json({
        status: "successful",
        message: "Todo created successfully",
        todo: newTodo
    });
};


const getTodo = (req, res) => {

    const userTodos = db.filter(
        (todo) => todo.userId === req.user.id
    );

    return res.status(200).json({
        status: "successful",
        todos: userTodos
    });
};


const getbyId = (req, res) => {

    const { id } = req.params;

    const todo = db.find(
        (todo) =>
            todo.id === Number(id) &&
            todo.userId === req.user.id
    );

    if (!todo) {
        return res.status(404).json({
            status: "error",
            message: "Todo not found"
        });
    }

    return res.status(200).json({
        status: "successful",
        todo
    });
};


const updateTodo = (req, res) => {

    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = db.find(
        (todo) =>
            todo.id === Number(id) &&
            todo.userId === req.user.id
    );

    if (!todo) {
        return res.status(404).json({
            status: "error",
            message: "Todo not found"
        });
    }

    if (title !== undefined) {
        todo.title = title;
    }

    if (description !== undefined) {
        todo.description = description;
    }

    if (completed !== undefined) {
        todo.completed = completed;
    }

    return res.status(200).json({
        status: "successful",
        message: "Todo updated successfully",
        todo
    });
};


const deleteid = (req, res) => {

    const { id } = req.params;

    const todo = db.find(
        (todo) =>
            todo.id === Number(id) &&
            todo.userId === req.user.id
    );

    if (!todo) {
        return res.status(404).json({
            status: "error",
            message: "Todo not found"
        });
    }

    db = db.filter(
        (todo) => todo.id !== Number(id)
    );

    return res.status(200).json({
        status: "successful",
        message: "Todo deleted successfully"
    });
};


module.exports = {
    getTodo,
    addTodo,
    getbyId,
    updateTodo,
    deleteid
};

