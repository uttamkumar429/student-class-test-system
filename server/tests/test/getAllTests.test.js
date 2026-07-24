const request = require("supertest");

const app = require("../../app");

const User = require("../../models/User");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createTest = require("../helpers/createTest");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
describe("Get All Tests API", () => {

  let token;

  beforeEach(async () => {

    await cleanup();

    token = await loginAdmin();

    const admin = await User.findOne({
      role: "admin",
    });

    const questions =
      await createQuestions(
        admin._id,
        "Physics"
      );

    const questionIds =
      questions.map((q) => q._id);

    await createTest(
      admin._id,
      questionIds
    );
 });
    test("Admin should get all tests", async () => {

        const response = await request(app)
            .get("/api/tests")
            .set(
            "Authorization",
            `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Tests fetched successfully."
        );

        expect(
            response.body.data.tests.length
        ).toBeGreaterThan(0);
    });
    test("Should reject without token", async () => {

        const response = await request(app)
            .get("/api/tests");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

    });
    test("Student should not get all tests", async () => {

        await cleanup();

        await loginAdmin();

        const admin = await User.findOne({
            role: "admin",
        });

        const questions = await createQuestions(
            admin._id,
            "Physics"
        );

        await createTest(
            admin._id,
            questions.map((q) => q._id)
        );

        await createUser(users.student);

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
            email: users.student.email,
            password: users.student.password,
            });
        // console.log(loginResponse.body);
        const studentToken = loginResponse.body.token;

        const response = await request(app)
            .get("/api/tests")
            .set(
            "Authorization",
            `Bearer ${studentToken}`
            );

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);

    });
    test("Should paginate tests", async () => {

        const admin = await User.findOne({
            role: "admin",
        });

        const questions = await createQuestions(
            admin._id,
            "Physics"
        );

        const questionIds = questions.map((q) => q._id);

        for (let i = 1; i <= 5; i++) {
            await createTest(admin._id, questionIds, {
            title: `Physics Test ${i}`,
            });
        }

        const response = await request(app)
            .get("/api/tests?page=1&limit=2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.tests.length).toBe(2);

    });
    test("Should search tests by title", async () => {

        const admin = await User.findOne({
            role: "admin",
        });

        const questions = await createQuestions(
            admin._id,
            "Physics"
        );

        const questionIds = questions.map((q) => q._id);

        await createTest(admin._id, questionIds, {
            title: "Physics Unit Test",
        });

        await createTest(admin._id, questionIds, {
            title: "Chemistry Mock Test",
            subject: "Chemistry",
        });

        const response = await request(app)
            .get("/api/tests?search=Physics")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.tests.length).toBeGreaterThan(0);

        response.body.data.tests.forEach((test) => {
            expect(test.title).toMatch(/Physics/i);
        });

    });    
    test("Should filter tests by subject", async () => {

        const response = await request(app)
            .get("/api/tests?subject=Physics")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        response.body.data.tests.forEach((test) => {
            expect(test.subject).toBe("Physics");
        });

    });
    test("Should filter tests by status", async () => {

        const admin = await User.findOne({ role: "admin" });

        const questions = await createQuestions(admin._id, "Physics");

        const questionIds = questions.map((q) => q._id);

        await createTest(admin._id, questionIds, {
            title: "Published Test",
            status: "published",
        });

        const response = await request(app)
            .get("/api/tests?status=published")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        response.body.data.tests.forEach((test) => {
            expect(test.status).toBe("published");
        });

    });
    test("Should sort tests by newest", async () => {

        const response = await request(app)
            .get("/api/tests?sort=newest")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        const tests = response.body.data.tests;

        for (let i = 1; i < tests.length; i++) {
            expect(
            new Date(tests[i - 1].createdAt).getTime()
            ).toBeGreaterThanOrEqual(
            new Date(tests[i].createdAt).getTime()
            );
        }

    });
    test("Should sort tests by oldest", async () => {

        const response = await request(app)
            .get("/api/tests?sort=oldest")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        const tests = response.body.data.tests;

        for (let i = 1; i < tests.length; i++) {
            expect(
            new Date(tests[i - 1].createdAt).getTime()
            ).toBeLessThanOrEqual(
            new Date(tests[i].createdAt).getTime()
            );
        }

    });
    test("Should return empty array when no tests match search", async () => {

        const response = await request(app)
            .get("/api/tests?search=Biology")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.tests).toHaveLength(0);

    });
    test("Should filter tests by duration", async () => {

        const response = await request(app)
            .get("/api/tests?duration=60")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        response.body.data.tests.forEach((test) => {
            expect(test.duration).toBe(60);
        });

    });
    test("Should sort tests by title", async () => {

        const response = await request(app)
            .get("/api/tests?sort=title")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        const tests = response.body.data.tests;

        for (let i = 1; i < tests.length; i++) {
            expect(
                tests[i - 1].title.localeCompare(tests[i].title)
            ).toBeLessThanOrEqual(0);
        }

    });
    test("Should sort tests by subject", async () => {

        const response = await request(app)
            .get("/api/tests?sort=subject")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });
    test("Should handle invalid page number", async () => {

        const response = await request(app)
            .get("/api/tests?page=-1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.data.page).toBe(1);

    });
    test("Should return all tests when limit is large", async () => {

        const response = await request(app)
            .get("/api/tests?limit=100")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.tests.length).toBeGreaterThan(0);

    });
});
  