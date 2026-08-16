const mongoose = require("mongoose");

const cleanup = require("../helpers/cleanup");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");

const ExamAttempt =
  require("../../models/ExamAttempt");

const TestSnapshot =
  require("../../models/TestSnapshot");

const studentService =
  require("../../services/student.service");

describe(
  "Get Result Service",
  () => {
    let student;
    let otherStudent;
    let snapshot;
    let submittedAttempt;
  
    // =====================================
    // SETUP
    // =====================================

    beforeEach(async () => {
      await cleanup();

      // -----------------------------------
      // Create primary student
      // -----------------------------------

      student =
        await createUser({
          ...users.student,
        });

      // -----------------------------------
      // Create another student
      // -----------------------------------

      otherStudent =
        await createUser({
          ...users.student,
          email:
            "other-student@test.com",
          phone:
            "9876543211",
        });

      // -----------------------------------
      // Create test snapshot
      // -----------------------------------

      const now = new Date();

      snapshot =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Physics Final Test",

          subject:
            "Physics",

          duration: 60,

          totalMarks: 10,

          totalQuestions: 5,

          startTime:
            new Date(
              now.getTime() -
                60 * 60 * 1000
            ),

          endTime:
            new Date(
              now.getTime() +
                60 * 60 * 1000
            ),

          questions: [],
        });

      // -----------------------------------
      // Create submitted attempt
      // -----------------------------------

      submittedAttempt =
        await ExamAttempt.create({
          student:
            student._id,

          testSnapshot:
            snapshot._id,

          startedAt:
            new Date(
              now.getTime() -
                30 * 60 * 1000
            ),

          submittedAt:
            new Date(
              now.getTime() -
                5 * 60 * 1000
            ),

          status:
            "SUBMITTED",

          currentQuestionIndex: 4,

          visitedQuestions: [],

          reviewQuestions: [],

          totalQuestions: 5,

          totalMarks: 10,

          correctAnswers: 4,

          wrongAnswers: 1,

          unansweredQuestions: 0,

          obtainedMarks: 8,

          percentage: 80,

          isPassed: true,

          timeTaken: 1500,
        });


    });

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. SUCCESSFUL RESULT
    // =====================================

    test(
      "Should return finalized result for a submitted exam",
      async () => {
        const result =
          await studentService.getResult(
            student._id,
            submittedAttempt._id
          );

        expect(result).toBeDefined();

        expect(
          result.attemptId.toString()
        ).toBe(
          submittedAttempt._id.toString()
        );

        expect(
          result.examTitle
        ).toBe(
          "Physics Final Test"
        );

        expect(
          result.subject
        ).toBe("Physics");

        expect(
          result.totalQuestions
        ).toBe(5);

        expect(
          result.answeredQuestions
        ).toBe(5);

        expect(
          result.correctAnswers
        ).toBe(4);

        expect(
          result.wrongAnswers
        ).toBe(1);

        expect(
          result.skippedAnswers
        ).toBe(0);

        expect(
          result.obtainedMarks
        ).toBe(8);

        expect(
          result.totalMarks
        ).toBe(10);

        expect(
          result.percentage
        ).toBe(80);

        expect(
          result.status
        ).toBe("Pass");

        expect(
          result.timeTaken
        ).toBe(1500);

        expect(
          result.submittedAt
        ).toBeDefined();
      }
    );

    // =====================================
    // 2. FAIL RESULT
    // =====================================

    test(
      "Should return Fail when the stored result is not passed",
      async () => {
        await ExamAttempt.findByIdAndUpdate(
          submittedAttempt._id,
          {
            $set: {
              obtainedMarks: 3,
              percentage: 30,
              correctAnswers: 2,
              wrongAnswers: 2,
              unansweredQuestions: 1,
              isPassed: false,
            },
          }
        );

        const result =
          await studentService.getResult(
            student._id,
            submittedAttempt._id
          );

        expect(
          result.obtainedMarks
        ).toBe(3);

        expect(
          result.percentage
        ).toBe(30);

        expect(
          result.correctAnswers
        ).toBe(2);

        expect(
          result.wrongAnswers
        ).toBe(2);

        expect(
          result.skippedAnswers
        ).toBe(1);

        expect(
          result.status
        ).toBe("Fail");

        expect(
          result.answeredQuestions
        ).toBe(4);
      }
    );

    // =====================================
    // 3. OWNERSHIP PROTECTION
    // =====================================

    test(
      "Should not allow another student to view the result",
      async () => {
        await expect(
          studentService.getResult(
            otherStudent._id,
            submittedAttempt._id
          )
        ).rejects.toMatchObject({
          statusCode: 403,
        });
      }
    );

    // =====================================
    // 4. RESULT NOT AVAILABLE BEFORE SUBMISSION
    // =====================================

test(
  "Should reject result request for an in-progress exam",
  async () => {
    const inProgressAttempt =
      await ExamAttempt.create({
        student:
          student._id,

        testSnapshot:
          new mongoose.Types.ObjectId(),

        startedAt:
          new Date(
            Date.now() -
              10 * 60 * 1000
          ),

        status:
          "IN-PROGRESS",

        currentQuestionIndex: 1,

        visitedQuestions: [],

        reviewQuestions: [],

        totalQuestions: 5,

        totalMarks: 10,
      });

    await expect(
      studentService.getResult(
        student._id,
        inProgressAttempt._id
      )
    ).rejects.toMatchObject({
      statusCode: 400,
      message:
        "Exam is not submitted yet.",
    });
  }
);

    // =====================================
    // 5. ATTEMPT NOT FOUND
    // =====================================

    test(
      "Should return 404 when exam attempt does not exist",
      async () => {
        const fakeAttemptId =
          new mongoose.Types.ObjectId();

        await expect(
          studentService.getResult(
            student._id,
            fakeAttemptId
          )
        ).rejects.toMatchObject({
          statusCode: 404,
          message:
            "Exam attempt not found.",
        });
      }
    );

    // =====================================
    // 6. SNAPSHOT NOT FOUND
    // =====================================

    test(
      "Should return 404 when test snapshot is missing",
      async () => {
        const attemptWithoutSnapshot =
          await ExamAttempt.create({
            student:
              student._id,

            testSnapshot:
              new mongoose.Types.ObjectId(),

            startedAt:
              new Date(
                Date.now() -
                  30 * 60 * 1000
              ),

            submittedAt:
              new Date(),

            status:
              "SUBMITTED",

            totalQuestions: 5,

            totalMarks: 10,

            correctAnswers: 4,

            wrongAnswers: 1,

            unansweredQuestions: 0,

            obtainedMarks: 8,

            percentage: 80,

            isPassed: true,

            timeTaken: 1500,
          });

        await expect(
          studentService.getResult(
            student._id,
            attemptWithoutSnapshot._id
          )
        ).rejects.toMatchObject({
          statusCode: 404,
          message:
            "Test snapshot not found.",
        });
      }
    );
  }
);