const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/users/:id", async (req, res) => {
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

router.patch("/users/:id", async (req, res) => {
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
router.delete("/users/:id", async (req, res) => {
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

module.exports = router;
