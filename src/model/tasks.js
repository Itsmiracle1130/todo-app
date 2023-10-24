const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskModel = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	status: {
		type: String,
		enum: ["pending", "completed", "deleted"],
		default: "pending"
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("tasks", taskModel);
