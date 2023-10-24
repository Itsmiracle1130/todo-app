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

const validateUserInfo = (userInfo) => {
	const schema = joi.object({
		username: joi.string().min(6).max(15).required(),
		password: joi.string().min(6).max(20).required()
	});
	return schema.validate(userInfo, options);
};

module.exports = {validateUserInfo};