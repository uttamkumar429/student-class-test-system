const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");
const User = require("../../models/User");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
const Question = require("../../models/Question");

describe("Get Question By ID API", () => {
  let token;
  let question;

//   beforeAll(async () => {
//     await cleanup();

//     token = await loginAdmin();
//     });

//   beforeEach(async () => {
//     await cleanup();

//     const admin = await User.findOne({
//         role: "admin",
//     });

//     await createQuestions(admin._id);

//     question = await Question.findOne();
//     });
   beforeEach(async () => {
    await cleanup();

    token = await loginAdmin();

    const admin = await User.findOne({
        role: "admin",
    });

    await createQuestions(admin._id);

    question = await Question.findOne();
    });

  test("Admin should get question by valid ID", async () => {
    const response = await request(app)
      .get(`/api/questions/${question._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data._id).toBe(
      question._id.toString()
    );
  });

  test("Should reject without token", async () => {
    const response = await request(app)
      .get(`/api/questions/${question._id}`);

    expect(response.statusCode).toBe(401);
  });

  test("Student should not access question", async () => {
    await createUser(users.student);

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
        password: users.student.password,
      });

    const response = await request(app)
      .get(`/api/questions/${question._id}`)
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      );

    expect(response.statusCode).toBe(403);
  });

  test("Should return error for invalid ObjectId", async () => {
    const response = await request(app)
      .get("/api/questions/abc123")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Invalid ID.");
  });

  test("Should return error when question not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/questions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Question not found.");
  });
});