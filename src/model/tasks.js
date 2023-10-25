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
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
}, 
{timestamps: true});

module.exports = mongoose.model("task", taskModel);
