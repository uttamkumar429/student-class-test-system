const request = require("supertest");

const app = require("../../app");
const User = require("../../models/User");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createUser = require("../helpers/createUser");
const users = require("../fixtures/users");
describe("Get All Questions API", () => {

  let token;
  let admin;

  beforeEach(async () => {
    await cleanup();

    token = await loginAdmin();

    admin = await User.findOne({
      role: "admin",
    });

    await createQuestions(admin._id);
  });
  
  test("Admin should get all questions", async () => {

    const response = await request(app)
      .get("/api/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.questions.length).toBeGreaterThan(0);

    expect(response.body.data.total).toBe(3);

  });

});
test("Should reject without token", async () => {

  const response = await request(app)
    .get("/api/questions");

  expect(response.statusCode).toBe(401);

});
test("Student should not access questions", async () => {

  await createUser(users.student);

  const login = await request(app)
    .post("/api/auth/login")
    .send({
      emailOrPhone: users.student.email,
      password: users.student.password,
    });

  const response = await request(app)
    .get("/api/questions")
    .set(
      "Authorization",
      `Bearer ${login.body.token}`
    );

  expect(response.statusCode).toBe(403);

});