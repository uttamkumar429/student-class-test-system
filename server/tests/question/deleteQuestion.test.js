const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
const User = require("../../models/User");
const Question = require("../../models/Question");
describe("Delete Question API", () => {
  let token;
  let question;

  beforeEach(async () => {
    await cleanup();

    token = await loginAdmin();

    const admin = await User.findOne({
      role: "admin",
    });

    await createQuestions(admin._id);

    question = await Question.findOne();
  });

//   afterAll(async () => {
//     await cleanup();
//     await mongoose.connection.close();
//   });

  test("Admin should delete question", async () => {
    const response = await request(app)
      .delete(`/api/questions/${question._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "Question deleted successfully."
    );

    const deletedQuestion =
      await Question.findById(question._id);

    expect(deletedQuestion).toBeNull();
  });

  test("Should reject without token", async () => {
    const response = await request(app)
      .delete(`/api/questions/${question._id}`);

    expect(response.statusCode).toBe(401);
  });

  test("Student should not delete question", async () => {
    await cleanup();

    await createUser(users.student);

    const adminToken = await loginAdmin();

    const admin = await User.findOne({
      role: "admin",
    });

    await createQuestions(admin._id);

    const studentLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: users.student.email,
        password: users.student.password,
      });
    //   console.log(studentLogin.body)
    const studentToken = studentLogin.body.token;

    question = await Question.findOne();

    const response = await request(app)
      .delete(`/api/questions/${question._id}`)
      .set(
        "Authorization",
        `Bearer ${studentToken}`
      );

    expect(response.statusCode).toBe(403);
  });

  test("Should return error for invalid ObjectId", async () => {
    const response = await request(app)
      .delete("/api/questions/abc123")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
  });

  test("Should return error when question not found", async () => {
    const fakeId =
      new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/questions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
  });
});