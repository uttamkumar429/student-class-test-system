const request = require("supertest");
const app = require("../../app");

const cleanup = require("../helpers/cleanup");
const createAdmin = require("../helpers/createAdmin");
const createUser = require("../helpers/createUser");
const users = require("../fixtures/users");

describe("Admin Login API", () => {

  beforeEach(async () => {
    await cleanup();
  });

  test("Should login successfully as admin", async () => {

    await createAdmin();

    const response = await request(app)
      .post("/api/auth/admin/login")
      .send({
        emailOrPhone: users.admin.email,
        password: users.admin.password,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.token).toBeDefined();

    expect(response.body.user.role).toBe("admin");

  });

  test("Should reject wrong password", async () => {

    await createAdmin();

    const response = await request(app)
      .post("/api/auth/admin/login")
      .send({
        emailOrPhone: users.admin.email,
        password: "WrongPassword",
      });

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);

  });

  test("Should reject missing credentials", async () => {

    const response = await request(app)
      .post("/api/auth/admin/login")
      .send({});

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

  });

  test("Should reject student trying admin login", async () => {

    await createUser(users.student);

    const response = await request(app)
      .post("/api/auth/admin/login")
      .send({
        emailOrPhone: users.student.email,
        password: users.student.password,
      });

    expect(response.statusCode).toBe(403);

    expect(response.body.success).toBe(false);

  });

  test("Should reject invalid request body", async () => {

    const response = await request(app)
      .post("/api/auth/admin/login")
      .send({
        emailOrPhone: {
          email: users.admin.email,
        },
        password: 12345,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

  });

});