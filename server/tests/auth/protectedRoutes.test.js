const request = require("supertest");

const app = require("../../app");

const cleanup = require("../helpers/cleanup");
const createAdmin = require("../helpers/createAdmin");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");

describe("Protected Route Authorization", () => {

  beforeEach(async () => {
    await cleanup();
  });

  // ----------------------------------
  // NO TOKEN
  // ----------------------------------

  test("Should reject request without token", async () => {

    const response = await request(app)
      .get("/api/admin/dashboard")

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);

  });

  // ----------------------------------
  // INVALID TOKEN
  // ----------------------------------

  test("Should reject invalid token", async () => {

    const response = await request(app)
      .get("/api/admin/dashboard")
      .set(
        "Authorization",
        "Bearer invalid_token"
      );

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);

  });

  // ----------------------------------
  // STUDENT SHOULD NOT ACCESS
  // ----------------------------------

  test("Student should not access admin dashboard", async () => {

    await createUser(users.student);

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
        password: users.student.password,
      });

    const response = await request(app)
      .get("/api/admin/dashboard")
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      );

    expect(response.statusCode).toBe(403);

    expect(response.body.success).toBe(false);

  });

  // ----------------------------------
  // ADMIN SHOULD ACCESS
  // ----------------------------------

  test("Admin should access dashboard", async () => {

    await createAdmin();

    const login = await request(app)
      .post("/api/auth/admin/login")
      .send({
        emailOrPhone: users.admin.email,
        password: users.admin.password,
      });

    const response = await request(app)
      .get("/api/admin/dashboard")
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      );

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

  });

});