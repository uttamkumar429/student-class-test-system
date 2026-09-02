const request = require("supertest");
const app = require("../../app");

const User = require("../../models/User");

const cleanup = require("../helpers/cleanup");
const users = require("../fixtures/users");

describe("Student Registration API", () => {

  beforeEach(async () => {
    await cleanup();
  });

  test("Should register a new student successfully", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: users.student.fullName,
        email: users.student.email,
        phone: users.student.phone,
        password: users.student.password,
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    // Registration intentionally does not issue a JWT.
    // The student must verify the mobile OTP before login.
    expect(response.body.token).toBeUndefined();
    expect(response.body.user.isVerified).toBe(false);

    expect(response.body.user.fullName).toBe(
      users.student.fullName
    );

    expect(response.body.user.role).toBe("student");
  });

  test("Should reject duplicate email", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        fullName: users.student.fullName,
        email: users.student.email,
        phone: users.student.phone,
        password: users.student.password,
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Another User",
        email: users.student.email,
        phone: "9999999998",
        password: "Student@123",
      });

    expect(response.statusCode).toBe(409);

    expect(response.body.success).toBe(false);

  });

  test("Should reject duplicate phone", async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        fullName: users.student.fullName,
        email: users.student.email,
        phone: users.student.phone,
        password: users.student.password,
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: "Another User",
        email: "another@test.com",
        phone: users.student.phone,
        password: "Student@123",
      });

    expect(response.statusCode).toBe(409);

    expect(response.body.success).toBe(false);

  });

  test("Should reject missing required fields", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: users.student.email,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

  });

  test("Should reject invalid email", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        fullName: users.student.fullName,
        email: "invalid-email",
        phone: users.student.phone,
        password: users.student.password,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

  });

});