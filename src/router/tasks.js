const express = require("express");
const { createTask, readTask, readAllTasks, updateTask, deleteTask, updateData } = require("../controller/task.js");

const router = express.Router();

router.post("/", createTask);

router.get("/", readAllTasks);

router.get("/create", (req, res) => {
	res.render("addTodo");
});

router.get("/update/:taskId", updateData);

router.get("/:taskId", readTask);

router.post("/update/:taskId", updateTask);

router.get("/delete/:taskId", deleteTask);

module.exports = router;