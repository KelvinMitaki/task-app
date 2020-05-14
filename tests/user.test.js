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
  const response = await request(app)
    .post("/users")
    .send({
      name: "Kevin",
      email: "kevinkhlif911@gmail.com",
      password: "mysimplename",
      age: 20,
    })
    .expect(201);

  // ASSERTIONS THAT THE DATABASE WAS CHANGED CORRECTLY
  const user = await User.findById(response.body.user._id);

  expect(user).not.toBe(null);
  // ASSERTIONS ABOUT THE RESPONSE
  expect(response.body).toMatchObject({
    user: {
      name: "Kevin",
      email: "kevinkhlif911@gmail.com",

      age: 20,
    },
    token: user.tokens[0].token,
  });
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);

  expect(response.body.token).toBe(user.tokens[1].token);
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
test("should delete profile for authenticated user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(response.body._id);
  expect(user).toBe(null);
});

test("should not delete profile for unauthenticated users", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(testUser._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({
      name: "Kelvin Mitaki",
      email: "kevinkhalifa911@gmail.com",
    })
    .expect(200);
  const user = await User.findById(response.body._id);

  expect(user).toMatchObject({
    name: "Kelvin Mitaki",
    email: "kevinkhalifa911@gmail.com",
  });
});
