const express = require("express");
const { createTask, readTask, readAllTasks, updateTask, deleteTask } = require("../controller/task.js");

const router = express.Router();

router.post("/", createTask);

router.get("/", readAllTasks);

router.get("/create", (req, res) => {
	res.render("addTodo");
});

router.get("/update/:taskId", async (req, res) => {
	const taskId = req.params.taskId;
	res.render("update", { taskId }); 
});

router.get("/:taskId", readTask);

router.patch("/:taskId", updateTask);

router.delete("/:taskId", deleteTask);

module.exports = router;