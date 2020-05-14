const User = require("../../src/models/user");
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

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(testUser).save();
};
module.exports = { setupDatabase, testUser };
