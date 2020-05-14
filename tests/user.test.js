const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const testUser = {
  name: "test",
  email: "test@gmail.com",
  password: "test@gmail.com",
  age: 25,
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
