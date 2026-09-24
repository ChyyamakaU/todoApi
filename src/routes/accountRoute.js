/* eslint-disable no-undef */
const express = require("express");

const authenticate = require("../middleware/authenticate");

const {
    getTodo,
    addTodo,
    getbyId,
    updateTodo,
    deleteid
} = require("../controllers/todoController");

const router = express.Router();


router.use(authenticate);


router.post("/", addTodo);

router.get("/", getTodo);

router.get("/:id", getbyId);

router.put("/:id", updateTodo);

router.delete("/:id", deleteid);

module.exports = router;