const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");

const User = require("../../models/User");
const Test = require("../../models/Test");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createTest = require("../helpers/createTest");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
describe("Update Test API", () => {

    let token;
    let createdTest;
    let admin;
    let questions;

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
    test("Admin should update test successfully", async () => {

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({

                title: "Updated Physics Test",

                subject: "Physics",

                description: "Updated Description",

                duration: 90,

                questions: questions.map(q => q._id),

                startTime: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                ),

                endTime: new Date(
                    Date.now() + 25 * 60 * 60 * 1000
                )

            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Test updated successfully."
        );

        expect(response.body.data.title).toBe(
            "Updated Physics Test"
        );

        expect(response.body.data.duration).toBe(90);

    });
    test("Should reject update test without token", async () => {

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: questions.map(q => q._id),
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });
    test("Student should not update test", async () => {

        await createUser(users.student);

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: users.student.email,
                password: users.student.password,
            });

        const studentToken = loginResponse.body.token;

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set(
                "Authorization",
                `Bearer ${studentToken}`
            )
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: questions.map(q => q._id),
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });
    test("Should reject invalid MongoDB ObjectId", async () => {

        const response = await request(app)
            .put("/api/tests/invalid-id")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: questions.map(q => q._id),
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });
    test("Should return 404 when test does not exist", async () => {

        const response = await request(app)
            .put(`/api/tests/${new mongoose.Types.ObjectId()}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: questions.map(q => q._id),
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Test not found.");

    });
    test("Should not update published test", async () => {

        await Test.findByIdAndUpdate(
            createdTest._id,
            { status: "published" }
        );

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: questions.map(q => q._id),
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Published test cannot be updated."
        );

    });
    test("Should reject duplicate title", async () => {

        const secondTest = await createTest(
            admin._id,
            questions.map(q => q._id),
            {
                title: "Chemistry Mock Test",
            }
        );

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: secondTest.title,
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: questions.map(q => q._id),
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Test with this title already exists."
        );

    });
    test("Should reject duplicate question IDs", async () => {

        const duplicateQuestions = [
            questions[0]._id,
            questions[0]._id,
        ];

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: duplicateQuestions,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        
        expect(response.body.message).toContain(
        "Duplicate questions are not allowed."
        );

    });
    test("Should reject invalid question IDs", async () => {

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: [
                    new mongoose.Types.ObjectId(),
                ],
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "One or more Question IDs are invalid."
        );

    });
    test("Should reject different subject questions", async () => {

        const chemistryQuestions = await createQuestions(
            admin._id,
            "Chemistry"
        );

        const mixedQuestions = [
            questions[0]._id,
            chemistryQuestions[0]._id,
        ];

        const response = await request(app)
            .put(`/api/tests/${createdTest._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Physics Test",
                subject: "Physics",
                description: "Updated Description",
                duration: 90,
                questions: mixedQuestions,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "All selected questions must belong to the same subject."
        );

    });
    test("Should reject start time in the past", async () => {

    const response = await request(app)
        .put(`/api/tests/${createdTest._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated Physics Test",
            subject: "Physics",
            description: "Updated Description",
            duration: 90,
            questions: questions.map(q => q._id),
            startTime: new Date(Date.now() - 60 * 60 * 1000),
            endTime: new Date(Date.now() + 60 * 60 * 1000),
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
        "Start time cannot be in the past."
    );

});
test("Should reject end time before start time", async () => {

    const response = await request(app)
        .put(`/api/tests/${createdTest._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated Physics Test",
            subject: "Physics",
            description: "Updated Description",
            duration: 90,
            questions: questions.map(q => q._id),
            startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 60 * 60 * 1000),
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message[0]).toBe(
        "End time must be greater than start time."
    );
});
test("Should return updated test details", async () => {

    const response = await request(app)
        .put(`/api/tests/${createdTest._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Final Physics Test",
            subject: "Physics",
            description: "Final Description",
            duration: 120,
            questions: questions.map(q => q._id),
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
        });

    expect(response.statusCode).toBe(200);

    const data = response.body.data;

    expect(data.title).toBe("Final Physics Test");
    expect(data.description).toBe("Final Description");
    expect(data.duration).toBe(120);

    expect(data.createdBy).toBeDefined();
    expect(data.createdBy.fullName).toBeDefined();

    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBeGreaterThan(0);

});

});