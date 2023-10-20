// import modules
const express = require("express");
const cors = require("express");
const bodyParser = require("body-parser");
const {database} = require("./db.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

database();

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to ToDo App"
	});
});

app.use((req, res) => {
	res.status(404).json({
		message: "Route not found"
	});
});

app.listen(port, () => {
	console.log(`Your server is running on port ${port}`);
});