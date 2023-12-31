const supertest = require("supertest");
const db = require("../db.js");
const createServer = require("../utility/server.js");
const { user5 } = require("./test/user.js");

const request = supertest(createServer());

const loginAndSetToken = async () => {
	try {
		await db.database();
		const response = await request.post("/users/login").send(user5);
		const token = response.headers["set-cookie"][0].split("=")[1].split(";")[0];
		return token;
	} catch (error) {
		console.error("Error logging in user:", error);
	}
};
module.exports = {
	loginAndSetToken
};
