const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");

const cleanup = require("../helpers/cleanup");
const loginAdmin = require("../helpers/loginAdmin");
const createQuestions = require("../helpers/createQuestions");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");
const User = require("../../models/User");
const Question = require("../../models/Question");

describe("Update Question API", () => {

  let token;
  let question;

  beforeEach(async () => {

    await cleanup();

    token = await loginAdmin();

    const admin = await User.findOne({
      role: "admin",
    });

    await createQuestions(admin._id);

    question = await Question.findOne();

  });

  test("Admin should update question", async () => {

    const response = await request(app)
      .put(`/api/questions/${question._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "Physics",
        chapter: "Motion",
        question: "Updated Question?",
        optionA: "10",
        optionB: "20",
        optionC: "30",
        optionD: "40",
        correctAnswer: "A",
        difficulty: "Easy",
        marks: 4,
        });

    expect(response.body.data.question)
    .toBe("Updated Question?");

    expect(response.body.data.subject)
    .toBe("Physics");

    expect(response.body.data.chapter)
    .toBe("Motion");

    expect(response.body.data.correctAnswer)
    .toBe("A");

    expect(response.body.data.marks)
    .toBe(4);

  });

  test("Should reject without token", async () => {

    const response = await request(app)
      .put(`/api/questions/${question._id}`)
      .send({
        subject: "Physics",
        chapter: "Motion",
        question: "Updated Question?",
        optionA: "10",
        optionB: "20",
        optionC: "30",
        optionD: "40",
        correctAnswer: "A",
        difficulty: "Easy",
        marks: 4,
     });

    expect(response.statusCode).toBe(401);

  });

  test("Student should not update question", async () => {

    await createUser(users.student);

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        emailOrPhone: users.student.email,
        password: users.student.password,
      });

    const response = await request(app)
      .put(`/api/questions/${question._id}`)
      .set(
        "Authorization",
        `Bearer ${login.body.token}`
      )
      .send({
        subject: "Physics",
        chapter: "Motion",
        question: "Updated Question?",
        optionA: "10",
        optionB: "20",
        optionC: "30",
        optionD: "40",
        correctAnswer: "A",
        difficulty: "Easy",
        marks: 4,
     });

    expect(response.statusCode).toBe(403);

  });

  test("Should return validation error", async () => {

    const response = await request(app)
      .put(`/api/questions/${question._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        questionText: ""
      });

    expect(response.statusCode).toBe(400);

  });

  test("Should return error for invalid ObjectId", async () => {

    const response = await request(app)
    .put("/api/questions/abc123")
    .set("Authorization", `Bearer ${token}`)
    .send({
        subject: "Physics",
        chapter: "Motion",
        question: "Updated Question?",
        optionA: "10",
        optionB: "20",
        optionC: "30",
        optionD: "40",
        correctAnswer: "A",
        difficulty: "Easy",
        marks: 4,
    });

    expect(response.statusCode).toBe(500);
  });

  test("Should return error when question not found", async () => {

    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
    .put(`/api/questions/${fakeId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
        subject: "Physics",
        chapter: "Motion",
        question: "Updated Question?",
        optionA: "10",
        optionB: "20",
        optionC: "30",
        optionD: "40",
        correctAnswer: "A",
        difficulty: "Easy",
        marks: 4,
    });

    expect(response.statusCode).toBe(500);
    // expect(response.statusCode).toBe(400);

  });

});