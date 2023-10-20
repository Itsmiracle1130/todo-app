const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DATABASE_URL;

function database() {
	mongoose.connect(DB_URL);

	mongoose.connection.on("connected", () => {
		console.log("Successfully connected to Mongodb");
	});

	mongoose.connection.on("error", (err) => {
		console.log(err);
		console.log("Error connecting to Mongodb");
	});
}

module.exports = {database};