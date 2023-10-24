const express = require("express");
const userRouter = require("./users.js");
const taskRouter = require("./tasks.js");
const ejsRouter = require("./ejs.js");
const { verifyToken } = require("../middleware/authenticate.js");

const router = express.Router();

router.use("/users", userRouter);
router.use("/tasks", verifyToken, taskRouter);
router.use("/api", ejsRouter);

module.exports = router;