const express = require("express");
const Task = require("../models/task");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });

    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });

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
router.patch("/tasks/:id", auth, async (req, res) => {
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
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();
    res.send(task);
  } catch (error) {
    if (error.message.includes("ObjectId")) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
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

module.exports = router;
