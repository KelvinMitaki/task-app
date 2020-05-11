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
    res.status(400).send(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ error: "No user found" });
    }
    res.send(user);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No user found" });
    }
    res.status(500).send(error);
  }
});

app.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);

  const isValidUpdates = ["name", "email", "password", "age"];

  const allowedUpdates = updates.every((update) =>
    isValidUpdates.includes(update)
  );
  if (!allowedUpdates) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const _id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send({ error: "No user found" });
    }
    res.send(updatedUser);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No user found" });
    }
    res.status(500).send(error);
  }
});
app.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return res.status(404).send({ error: "No user found" });
    }
    res.send(deletedUser);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No user found" });
    }
    res.status(500).send(error);
  }
});
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
app.get("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send(" task not found");
    }
    res.send(task);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(500).send("Internal server error");
  }
});
app.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["completed", "description"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  const _id = req.params.id;
  if (!isValidUpdates) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(updatedTask);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(500).send(error);
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask) {
      return res.status(404).send({ error: "No task found" });
    }
    res.send(deletedTask);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "No task found" });
    }
    res.status(500).send(error);
  }
});

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
