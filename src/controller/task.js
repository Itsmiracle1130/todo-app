const {validateTaskInfo} = require("../validation/task");
const models = require("../model/models");

const createTask = async(req, res) => {
	const username = req.user;

	try {
		const user = await models.user.findOne(username);
		const {error, value} = validateTaskInfo(req.body);
		if (error) {
			res.status(404).send({
				status: false,
				message: "Task creation failed"
			});
		}
		const createdTask = await models.task.create({
			title: value.title,
			description: value.description,
			user: user.id
		});
		return res.status(201).render("checkOne"), ({
			task: createdTask,
			taskId: createdTask.id
		});

	} catch (error) {
		console.error("Error creating task");
		res.status(500).send({
			status: false,
			message: error
		});
	}
};

const readAllTasks = async(req, res) => {
	const username = req.user;
	let { page, limit, status } = req.query;

	try {
		const user = await models.user.findOne({ username });
		page = page || 1;
		limit = limit || 10;
		
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		
		let query = { status: "pending", user: user.id };

		if (status) {
			if (status === "deleted") {
				query.status = "deleted";
			} else if (status === "completed") {
				query.status = "completed";
			}
		}

		const tasks = await models.task.find(query)
			.limit(endIndex)
			.skip(startIndex)
			.exec();
		
		if (tasks.length < 1) {
			return res.status(204).send({
				status: true,
				message: "No data"
			});
		}

		const count = await models.task.countDocuments(query);
		
		const totalPages = Math.ceil(count / limit);
		const total = tasks.length;
		
		return res.status(200).json({
			status: true,
			message: "Tasks fetched successfully",
			data: {
				total,
				totalPages,
				currentPage: page,
				tasks
			}
		});
        
	} catch (error) {
		console.error("Error reading task");
		res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const readTask = async (req, res) => {
	const { username } = req.user;
	const { taskId } = req.params;
    
	try {
		const user = await models.user.findOne({ username });
		const task = await models.task.findOne({ _id: taskId, user: user.id });

		if (!task) {
			return res.status(404).json({
				status: false,
				message: "Task not found"
			});
		}

		if (task.status === "deleted") {
			return res.status(204).json({
				status: true,
				message: "No data"
			});
		}

		return res.status(200).json({
			status: true,
			message: "Task located",
			data: task
		});
	} catch (error) {
		console.error("Error reading task");
		res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const updateTask = async (req, res) => {
	const { username } = req.user;
	const { taskId } = req.params;

	try {
		const user = await models.User.findOne({ username });
		const task = await models.Task.findOne({ _id: taskId, user: user.id });

		if (!task) {
			return res.status(404).send({
				status: false,
				message: "Task not found"
			});
		}

		if (task.status === "deleted") {
			return res.status(204).send({
				status: true,
				message: "No data"
			});
		}

		const updateObject = {};
		if (req.body.title) updateObject.title = req.body.title;
		if (req.body.description) updateObject.description = req.body.description;
		if (req.body.status) updateObject.status = req.body.status;

		const updatedTask = await models.Task.findByIdAndUpdate(taskId, updateObject, { new: true });

		return res.status(200).json({
			status: true,
			message: "Task updated",
			data: updatedTask
		});
	} catch (error) {
		console.error("Error updating task");
		res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const deleteTask = async (req, res) => {
	const { username } = req.user;
	const { taskId } = req.params;
  
	try {
		const user = await models.User.findOne({ username });
		const task = await models.Task.findOne({ _id: taskId, user: user.id });
  
		if (!task) {
			return res.status(404).send({
				status: false,
				message: "Task not found"
			});
		}
  
		if (task.status === "deleted") {
			return res.status(204).send({
				status: true,
				message: "No data"
			});
		}
  
		await models.Task.findByIdAndUpdate(taskId, { status: "deleted" }, { upsert: true });
  
		return res.status(204).json({
			status: true,
			message: "Task deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting task");
		res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

module.exports = {
	createTask, readTask, readAllTasks, updateTask, deleteTask
};