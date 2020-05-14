const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
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

beforeEach(async () => {
  await User.deleteMany();
  await new User(testUser).save();
});

test("should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Kevin",
      email: "kevinkhlif911@gmail.com",
      password: "mysimplename",
      age: 20,
    })
    .expect(201);
});

test("should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .expect(200);
});

test("should not login non existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "hgsjhd@HGjhghj",
      password: "jkshkjhdsjkhdkhsdkj",
    })
    .expect(404);
});

test("should get profile for authenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated users", async () => {
  await request(app).get("/users/me").send().expect(401);
});
