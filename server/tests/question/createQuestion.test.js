const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
const question = require("../fixtures/question");

describe("Create Question API", () => {

  beforeEach(async () => {
    await cleanup();
  });

  test("Admin should create question", async () => {

    const token = await loginAdmin();

    const response = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send(question.physicsQuestion);

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.subject)
      .toBe("Physics");

  });

  test("Should reject without token", async () => {

    const response = await request(app)
      .post("/api/questions")
      .send(question.physicsQuestion);

    expect(response.statusCode).toBe(401);

  });

  test("Student should not create question", async () => {

    await createUser(users.student);

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
        password: users.student.password,
      });

    const response = await request(app)
      .post("/api/questions")
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      )
      .send(question.physicsQuestion);

    expect(response.statusCode).toBe(403);

  });

  test("Should reject invalid data", async () => {

    const token = await loginAdmin();

    const response = await request(app)
      .post("/api/questions")
      .set(
        "Authorization",
        `Bearer ${token}`
      )
      .send({
        subject: "",
      });

    expect(response.statusCode).toBe(400);

  });

});