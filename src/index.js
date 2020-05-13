const express = require("express");
const taskRouter = require("./routers/task");
const userRouter = require("./routers/user");
require("./db/mongoose");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
