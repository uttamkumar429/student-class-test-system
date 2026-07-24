const request = require("supertest");

const app = require("../app");

const User = require("../models/User");
const Test = require("../models/Test");
const mongoose = require("mongoose");
const cleanup = require("./helpers/cleanup");
const loginAdmin = require("./helpers/loginAdmin");
const createQuestions = require("./helpers/createQuestions");
const createTest = require("./helpers/createTest");
const createUser = require("./helpers/createUser");

const users = require("./fixtures/users");

describe("Delete Test API", () => {

    let token;
    let admin;
    let questions;
    let createdTest;

    beforeEach(async () => {

        await cleanup();

        token = await loginAdmin();

        admin = await User.findOne({
            role: "admin",
        });

        questions = await createQuestions(
            admin._id,
            "Physics"
        );

        createdTest = await createTest(
            admin._id,
            questions.map(q => q._id)
        );

    });
    test("Admin should delete test successfully", async () => {

        const response = await request(app)
            .delete(`/api/tests/${createdTest._id}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Test deleted successfully."
        );

        const deletedTest = await Test.findById(
            createdTest._id
        );

        expect(deletedTest).toBeNull();

    });
    test("Should reject request without token", async () => {

        const response = await request(app)
            .delete(`/api/tests/${createdTest._id}`);

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

    });
    test("Student should not be allowed to delete a test", async () => {

        await createUser(users.student);

        const studentLogin = await request(app)
            .post("/api/auth/login")
            .send({
                email: users.student.email,
                password: users.student.password,
            });

        const studentToken = studentLogin.body.token;

        const response = await request(app)
            .delete(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);

    });
    test("Should return 400 for invalid Test ID", async () => {

        const response = await request(app)
            .delete("/api/tests/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });
    test("Should return 404 if test does not exist", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/tests/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Test not found.");

    });

    test("Should not delete published test", async () => {

        createdTest.status = "published";
        await createdTest.save();

        const response = await request(app)
            .delete(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Published test cannot be deleted."
        );

    });

    test("Deleted test should no longer exist in database", async () => {

        await request(app)
            .delete(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`);

        const deleted = await Test.findById(createdTest._id);

        expect(deleted).toBeNull();

    });

});