const request = require("supertest");

const app = require("../../app");

const User = require("../../models/User");
const Test = require("../../models/Test");
const Question = require("../../models/Question");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");

const { validTest } = require("../fixtures/test");
const createUser = require("../helpers/createUser");
const users = require("../fixtures/users");
const mongoose = require("mongoose");
describe("Create Test API", () => {

  let token;
  let admin;
  let questions;

  beforeEach(async () => {

    await cleanup();

    token = await loginAdmin();

    admin = await User.findOne({
      role: "admin",
    });

    // Create same subject questions
    questions = await createQuestions(
      admin._id,
      "Physics"
    );

  });

  test("Admin should create test successfully", async () => {

    const payload = {
      ...validTest,
      questions: questions.map((q) => q._id),
    };

    const response = await request(app)
      .post("/api/tests")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "Test created successfully."
    );

    expect(response.body.data.title)
      .toBe(payload.title);

    expect(response.body.data.subject)
      .toBe(payload.subject);

    expect(response.body.data.questions.length)
      .toBe(questions.length);

    const savedTest = await Test.findById(
      response.body.data._id
    );

    expect(savedTest).not.toBeNull();

    expect(savedTest.title)
      .toBe(payload.title);

    expect(savedTest.totalQuestions)
      .toBe(questions.length);

  });
  test("Should reject without token", async () => {

  const payload = {
    ...validTest,
    questions: questions.map((q) => q._id),
  };

  const response = await request(app)
    .post("/api/tests")
    .send(payload);

  expect(response.statusCode).toBe(401);

  expect(response.body.success).toBe(false);

});
test("Student should not create test", async () => {

  await cleanup();

  await createUser(users.student);

  const adminToken = await loginAdmin();

  const admin = await User.findOne({
    role: "admin",
  });

  questions = await createQuestions(
    admin._id,
    "Physics"
  );

  const studentLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: users.student.email,
      password: users.student.password,
    });

  const studentToken = studentLogin.body.token;

  const payload = {
    ...validTest,
    questions: questions.map((q) => q._id),
  };

  const response = await request(app)
    .post("/api/tests")
    .set(
      "Authorization",
      `Bearer ${studentToken}`
    )
    .send(payload);

  expect(response.statusCode).toBe(403);

  expect(response.body.success).toBe(false);

});
test("Should return validation error", async () => {

  const payload = {
    title: "",
    subject: "",
    duration: 0,
    questions: [],
    startTime: "",
    endTime: "",
  };

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.statusCode).toBe(400);

  expect(response.body.success).toBe(false);

});
test("Should reject duplicate test title", async () => {

  const payload = {
    ...validTest,
    questions: questions.map((q) => q._id),
  };

  await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.statusCode).toBe(500);

  expect(response.body.success).toBe(false);

  expect(response.body.message).toBe(
    "Test with this title already exists."
  );

});
test("Should reject duplicate question IDs", async () => {

  const payload = {
    ...validTest,
    questions: [
      questions[0]._id,
      questions[0]._id,
    ],
  };

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.statusCode).toBe(500);

  expect(response.body.success).toBe(false);

  expect(response.body.message).toBe(
    "Duplicate questions are not allowed."
  );

});
test("Should reject invalid question IDs", async () => {

  const payload = {
    ...validTest,
    questions: [
      new mongoose.Types.ObjectId(),
    ],
  };

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.statusCode).toBe(500);

  expect(response.body.success).toBe(false);

  expect(response.body.message).toBe(
    "One or more Question IDs are invalid."
  );

});
test("Should reject different subject questions", async () => {

  await cleanup();

  token = await loginAdmin();

  const admin = await User.findOne({
    role: "admin",
  });

  const mixedQuestions =
    await createQuestions(admin._id);

  const payload = {
    ...validTest,
    questions: mixedQuestions.map(
      (q) => q._id
    ),
  };

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.statusCode).toBe(500);

  expect(response.body.success).toBe(false);

  expect(response.body.message).toBe(
    "All selected questions must belong to the same subject."
  );

});
test("Should reject past start time", async () => {

  const payload = {
    ...validTest,

    questions: questions.map(
      (q) => q._id
    ),

    startTime: new Date(
      Date.now() - 60 * 60 * 1000
    ),

    endTime: new Date(
      Date.now() + 60 * 60 * 1000
    ),
  };

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  expect(response.statusCode).toBe(500);

  expect(response.body.success).toBe(false);

  expect(response.body.message).toBe(
    "Start time cannot be in the past."
  );

});
test("Should reject end time before start time", async () => {

  const payload = {
    ...validTest,

    questions: questions.map(
      (q) => q._id
    ),

    startTime: new Date(
      Date.now() + 2 * 60 * 60 * 1000
    ),

    endTime: new Date(
      Date.now() + 60 * 60 * 1000
    ),
  };

  const response = await request(app)
    .post("/api/tests")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);

  // Validator catches this first
  expect(response.statusCode).toBe(400);

  expect(response.body.success).toBe(false);

});

});