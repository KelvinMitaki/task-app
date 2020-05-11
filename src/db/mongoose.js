const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const User = new mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.default.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.includes("password")) {
        throw new Error("Password is invalid");
      }
      if (value.length < 6) {
        throw new Error("Password must be six or more characters");
      }
    },
  },
});

const me = new User({
  name: "    Kelvin   ",
  age: 20,
  email: "Kevin@gmail.com",
  password: "kevinmitaki",
});

// me.save()
//   .then(() => console.log(me))
//   .catch((err) => console.log(err));

const Task = new mongoose.model("Task", {
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const task = new Task({
  description: "      Master JavaScript      ",
});

task
  .save()
  .then(() => console.log(task))
  .catch((err) => console.log(err));
