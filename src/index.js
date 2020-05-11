const express = require("express");
const User = require("./models/user");
const Task = require("./models/task");
require("./db/mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(err);
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    res.send(user);
  } catch (error) {
    res.status(404).send("User not found");
  }
});

app.get("/tasks", async (req, res) => {
  try {
    await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    await Task.findById(_id);
    res.send(task);
  } catch (error) {
    res.status(404).send(" task found");
  }
});

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
