const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { setupDatabase, testUser } = require("./fixtures/db");

beforeEach(setupDatabase);
test("should create a task for a logged in user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${testUser.tokens[0].token}`)
    .send({
      description: "Task for user",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});
