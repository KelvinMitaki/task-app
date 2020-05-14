const express = require("express");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

module.exports = app;
