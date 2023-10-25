const express = require("express");
const userController = require("../controller/user.js");

const {userReg, userLogin} = userController;

const userRoute = express.Router();

userRoute.post("/", userReg);

userRoute.post("/login", userLogin);

userRoute.get("/register", (req, res) => {
	res.render("register");
});
  
userRoute.get("/login", (req, res) => {
	res.render("login");
});

userRoute.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

module.exports = userRoute;