const User = require("../../src/models/user");
const Task = require("../../src/models/task");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userId = new mongoose.Types.ObjectId();

const testUser = {
  _id: userId,
  name: "test",
  email: "test@gmail.com",
  password: "test@gmail.com",
  age: 25,
  tokens: [
    {
      token: jwt.sign({ _id: userId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();

const testUserTwo = {
  _id: userTwoId,
  name: "kev",
  email: "kev@gmail.com",
  password: "kev@gmail.com",
  age: 25,
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task One",
  completed: false,
  owner: userId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task Two",
  completed: true,
  owner: userId,
};
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Task Three",
  completed: false,
  owner: testUserTwo,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(testUser).save();
  await new User(testUserTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};
module.exports = { setupDatabase, testUser, testUserTwo };
