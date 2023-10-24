const express = require("express");
const userController = require("../controller/user.js");

const {userReg, userLogin} = userController;

const userRoute = express.Router();

userRoute.post("/", userReg);

userRoute.post("/login", userLogin);

module.exports = userRoute;