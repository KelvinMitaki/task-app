const express = require("express");
const User = require("./models/user");
const Task = require("./models/task");
require("./db/mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => res.status(201).send(user))
    .catch((err) => res.status(400).send(err));
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => res.status(201).send(task))
    .catch((err) => res.status(400).send(err));
});

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send("Internal Server Error"));
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => res.send(user))
    .catch((err) => res.status(404).send("User not found"));
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => res.send(tasks))
    .catch((err) => res.status(500).send("Intrnal server error"));
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => res.send(task))
    .catch((err) => res.status(404).send("No task found"));
});

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
