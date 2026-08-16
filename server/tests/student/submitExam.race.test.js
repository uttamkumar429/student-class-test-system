const mongoose = require("mongoose");

const cleanup = require("../helpers/cleanup");
const createUser = require("../helpers/createUser");
const createQuestions = require("../helpers/createQuestions");

const users = require("../fixtures/users");

const ExamAttempt =
  require("../../models/ExamAttempt");

const TestSnapshot =
  require("../../models/TestSnapshot");

const StudentAnswer =
  require("../../models/StudentAnswer");

const Notification =
  require("../../models/Notification");

const studentService =
  require("../../services/student.service");

describe(
  "Submit Exam Race Condition",
  () => {
    let student;
    let admin;
    let question;
    let snapshot;
    let attempt;

    // =====================================
    // SETUP
    // =====================================

    beforeEach(async () => {
      await cleanup();

      // -----------------------------------
      // Create student
      // -----------------------------------

      student =
        await createUser({
          ...users.student,
        });

      // -----------------------------------
      // Create admin
      // -----------------------------------

      admin =
        await createUser({
          ...users.admin,
        });

      // -----------------------------------
      // Create question
      // -----------------------------------

      const questions =
        await createQuestions(
          admin._id
        );

      question =
        questions[0];

      // -----------------------------------
      // Create active snapshot
      // -----------------------------------

      const now =
        new Date();

      snapshot =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Concurrent Submit Test",

          subject:
            "Physics",

          duration: 60,

          totalMarks:
            question.marks,

          totalQuestions: 1,

          startTime:
            new Date(
              now.getTime() -
                10 * 60 * 1000
            ),

          endTime:
            new Date(
              now.getTime() +
                60 * 60 * 1000
            ),

          questions: [
            {
              questionId:
                question._id,

              subject:
                question.subject,

              chapter:
                question.chapter,

              difficulty:
                question.difficulty,

              question:
                question.question,

              optionA:
                question.optionA,

              optionB:
                question.optionB,

              optionC:
                question.optionC,

              optionD:
                question.optionD,

              correctAnswer:
                question.correctAnswer,

              explanation:
                question.explanation,

              marks:
                question.marks,
            },
          ],
        });

      // -----------------------------------
      // Create running attempt
      // -----------------------------------

      attempt =
        await ExamAttempt.create({
          student:
            student._id,

          testSnapshot:
            snapshot._id,

          startedAt:
            new Date(
              now.getTime() -
                2 * 60 * 1000
            ),

          status:
            "IN-PROGRESS",

          currentQuestionIndex: 0,

          visitedQuestions: [],

          reviewQuestions: [],

          totalQuestions: 1,

          totalMarks:
            question.marks,
        });

      // -----------------------------------
      // Save one correct answer
      // -----------------------------------

      await StudentAnswer.create({
        attempt:
          attempt._id,

        questionId:
          question._id,

        selectedAnswer:
          question.correctAnswer,

        correctAnswer:
          question.correctAnswer,

        isCorrect: true,

        marksAwarded:
          question.marks,

        answeredAt:
          new Date(),
      });
    });

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. CONCURRENT SUBMISSION
    // =====================================

    test(
      "Should allow only one successful submission for concurrent requests",
      async () => {
        const results =
          await Promise.allSettled([
            studentService.submitExam(
              student._id,
              attempt._id
            ),

            studentService.submitExam(
              student._id,
              attempt._id
            ),
          ]);

        const fulfilled =
          results.filter(
            (result) =>
              result.status ===
              "fulfilled"
          );

        const rejected =
          results.filter(
            (result) =>
              result.status ===
              "rejected"
          );

        expect(
          fulfilled
        ).toHaveLength(1);

        expect(
          rejected
        ).toHaveLength(1);

        expect(
        rejected[0].reason.statusCode
        ).toBe(409);

        expect(
        rejected[0].reason.message
        ).toBe(
        "Exam has already been submitted."
        );
      }
    );

    // =====================================
    // 2. FINAL STATE
    // =====================================

    test(
      "Should leave the exam attempt in SUBMITTED state after concurrent submission",
      async () => {
        await Promise.allSettled([
          studentService.submitExam(
            student._id,
            attempt._id
          ),

          studentService.submitExam(
            student._id,
            attempt._id
          ),
        ]);

        const finalAttempt =
          await ExamAttempt.findById(
            attempt._id
          ).lean();

        expect(
          finalAttempt.status
        ).toBe("SUBMITTED");

        expect(
          finalAttempt.submittedAt
        ).toBeDefined();

        expect(
          finalAttempt.obtainedMarks
        ).toBe(
          question.marks
        );

        expect(
          finalAttempt.totalMarks
        ).toBe(
          question.marks
        );

        expect(
          finalAttempt.percentage
        ).toBe(100);
      }
    );

    // =====================================
    // 3. ONE RESULT NOTIFICATION
    // =====================================

    test(
      "Should create only one RESULT notification after concurrent submission",
      async () => {
        await Promise.allSettled([
          studentService.submitExam(
            student._id,
            attempt._id
          ),

          studentService.submitExam(
            student._id,
            attempt._id
          ),
        ]);

        const notifications =
          await Notification.find({
            student:
              student._id,

            type:
              "RESULT",

            relatedId:
              attempt._id,

            relatedModel:
              "ExamAttempt",
          }).lean();

        expect(
          notifications
        ).toHaveLength(1);

        expect(
          notifications[0].title
        ).toBe(
          "Result Declared"
        );

        expect(
          notifications[0].actionUrl
        ).toBe(
          `/student/result/${attempt._id}`
        );
      }
    );

    // =====================================
    // 4. NO DUPLICATE ANSWER DATA
    // =====================================

    test(
      "Should preserve a single answer record during concurrent submission",
      async () => {
        await Promise.allSettled([
          studentService.submitExam(
            student._id,
            attempt._id
          ),

          studentService.submitExam(
            student._id,
            attempt._id
          ),
        ]);

        const answers =
          await StudentAnswer.find({
            attempt:
              attempt._id,

            questionId:
              question._id,
          }).lean();

        expect(
          answers
        ).toHaveLength(1);

        expect(
          answers[0].selectedAnswer
        ).toBe(
          question.correctAnswer
        );

        expect(
          answers[0].isCorrect
        ).toBe(true);

        expect(
          answers[0].marksAwarded
        ).toBe(
          question.marks
        );
      }
    );

    // =====================================
    // 5. SUBSEQUENT SUBMISSION REJECTED
    // =====================================

    test(
      "Should reject another submission after the race has completed",
      async () => {
        await Promise.allSettled([
          studentService.submitExam(
            student._id,
            attempt._id
          ),

          studentService.submitExam(
            student._id,
            attempt._id
          ),
        ]);

        await expect(
          studentService.submitExam(
            student._id,
            attempt._id
          )
        ).rejects.toMatchObject({
          statusCode: 409,

          message:
            "Exam already submitted.",
        });
      }
    );
  }
);