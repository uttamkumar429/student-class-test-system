const request = require("supertest");
const app = require("../../app");

const createUser = require("../helpers/createUser");
const cleanup = require("../helpers/cleanup");
const users = require("../fixtures/users");
// const User = require("../../models/User");
// const cleanup = require("../helpers/cleanup");
describe("Student Login API", () => {
   beforeEach(async () => {

    await cleanup();

    await createUser(users.student);

    });
  test("Should login successfully with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
        password: users.student.password,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.token).toBeDefined();

    expect(response.body.user.fullName).toBe(
      users.student.fullName
    );

    expect(response.body.user.role).toBe("student");
  });

  test("Should reject wrong password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
        password: "WrongPassword",
      });

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });

  test("Should reject missing password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);
  });

  test("Should reject missing email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: users.student.password,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);
  });

  test("Should reject invalid request body", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: {
          email: users.student.email,
        },
        password: 12345,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);
  });
});
// afterAll(async () => {

//   await cleanup();

// });