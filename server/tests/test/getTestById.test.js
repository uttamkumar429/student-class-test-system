const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const User = require("../../models/User");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createTest = require("../helpers/createTest");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
describe("Get Test By ID API", () => {

    let token;
    let createdTest;

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

        createdTest = await createTest(
            admin._id,
            questions.map(q => q._id)
        );

    });
    test("Admin should get test by valid ID", async () => {

        const response = await request(app)
            .get(`/api/tests/${createdTest._id}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Test fetched successfully."
        );

        expect(response.body.data._id).toBe(
            createdTest._id.toString()
        );

        expect(response.body.data.title).toBe(
            "Physics Mock Test"
        );

    });
    test("Should reject without token", async () => {

        const response = await request(app)
            .get(`/api/tests/${createdTest._id}`);

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

    });
    test("Student should not get test by ID", async () => {

        await cleanup();

        await loginAdmin();

        const admin = await User.findOne({
            role: "admin",
        });

        const questions = await createQuestions(
            admin._id,
            "Physics"
        );

        const createdTest = await createTest(
            admin._id,
            questions.map(q => q._id)
        );

        await createUser(users.student);

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: users.student.email,
                password: users.student.password,
            });

        const studentToken = loginResponse.body.token;

        const response = await request(app)
            .get(`/api/tests/${createdTest._id}`)
            .set(
                "Authorization",
                `Bearer ${studentToken}`
            );

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);

    });
    test("Should reject invalid MongoDB ObjectId", async () => {

        const response = await request(app)
            .get("/api/tests/invalid-id")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });
    test("Should return 404 when test does not exist", async () => {

        const response = await request(app)
            .get(`/api/tests/${new mongoose.Types.ObjectId()}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Test not found."
        );

    });
    test("Should return populated test details", async () => {

        const response = await request(app)
            .get(`/api/tests/${createdTest._id}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        const testData = response.body.data;

        expect(testData.createdBy).toBeDefined();

        expect(testData.createdBy.fullName).toBeDefined();

        expect(Array.isArray(testData.questions)).toBe(true);

        expect(testData.questions.length).toBeGreaterThan(0);

    });
});