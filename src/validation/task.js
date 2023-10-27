const joi = require("joi");

const options = {
	stripUnknown: true,
	abortEarly: false,
	errors: {
		wrap: {
			label: ""
		}
	}
};

const validateTaskInfo = (taskInfo) => {
	const schema = joi.object({
		title: joi.string().min(2).max(50).required(),
		description: joi.string().min(4).max(1000).required(),
	});
	return schema.validate(taskInfo, options);
};

module.exports = {validateTaskInfo};