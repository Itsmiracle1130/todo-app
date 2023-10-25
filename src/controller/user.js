const {validateUserInfo} = require("../validation/user");
const models = require("../model/models");
const bcrypt = require("bcrypt");
const { createToken } = require("../utility/jwt.js");

const userReg = async (req, res) => {
	try {
		const { error, value } = validateUserInfo(req.body);
		if(error) {
			return res.status(400).send({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.user.findOne({ username: value.username });
		if(existingUser) {
			return res.status(409).send({
				status: false,
				message: "User already exist"
			});
		}
		const hashedPassword = await bcrypt.hash(value.password, 10);
		const createdUser = await models.user.create({
			firstName: value.firstName,
			lastName: value.lastName,
			username: value.username,
			password: hashedPassword
		});
		return res.status(201).json({
			status: true,
			message: "User successfully created",
			data: createdUser
		});
	} catch (error) {
		console.error("Error fetching user data", error);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

const userLogin = async (req, res) => {
	try {
		const { error, value } = validateUserInfo(req.body);
		if(error) {
			return res.status(400).send({
				status: false,
				message: error.message
			});
		}
		const existingUser = await models.user.findOne({ username: value.username });
		if(!existingUser) {
			return res.status(404).send({
				status: false,
				message: "Invalid username or password"
			});
		}
		const passwordCompare = await bcrypt.compare(value.password, existingUser.password);
		if(!passwordCompare) {
			return res.status(404).send({
				status: false,
				message: "Invalid username or password"
			});
		}
		const token = await createToken({ id: existingUser.id, username: existingUser.username});
		const user = await models.user.findOne({ username: value.username }).select("-password");
		console.log(user);
		res.cookie("token", token, { httpOnly: true });
		return res.status(200).render("dashboard", ({
			user
		}));
	} catch (error) {
		console.error("Error fetching user Data", error);
		return res.status(500).send({
			status: false,
			message: "Internal server error"
		});
	}
};

module.exports = {
	userReg, userLogin
};