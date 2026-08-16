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

const studentService =
  require("../../services/student.service");

describe(
  "Get Review Answers Service",
  () => {
    let student;
    let otherStudent;

    let questionOne;
    let questionTwo;

    let snapshot;
    let submittedAttempt;
    let inProgressAttempt;

    // =====================================
    // SETUP
    // =====================================

    beforeEach(async () => {
      await cleanup();

      // -----------------------------------
      // Create students
      // -----------------------------------

      student =
        await createUser({
          ...users.student,
        });

      otherStudent =
        await createUser({
          ...users.student,
          email:
            "other-review-student@test.com",
          phone:
            "9876543213",
        });

      // -----------------------------------
      // Create admin for questions
      // -----------------------------------

      const admin =
        await createUser({
          ...users.admin,
        });

      const questions =
        await createQuestions(
          admin._id
        );

      questionOne = questions[0];
      questionTwo = questions[1];

      // -----------------------------------
      // Create snapshot
      // -----------------------------------

      const now = new Date();

      snapshot =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Physics Review Test",

          subject:
            "Physics",

          duration: 60,

          totalMarks:
            questionOne.marks +
            questionTwo.marks,

          totalQuestions: 2,

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

          questions: [
            {
              questionId:
                questionOne._id,

              subject:
                questionOne.subject,

              chapter:
                questionOne.chapter,

              difficulty:
                questionOne.difficulty,

              question:
                questionOne.question,

              optionA:
                questionOne.optionA,

              optionB:
                questionOne.optionB,

              optionC:
                questionOne.optionC,

              optionD:
                questionOne.optionD,

              correctAnswer:
                questionOne.correctAnswer,

              explanation:
                questionOne.explanation,

              marks:
                questionOne.marks,
            },

            {
              questionId:
                questionTwo._id,

              subject:
                questionTwo.subject,

              chapter:
                questionTwo.chapter,

              difficulty:
                questionTwo.difficulty,

              question:
                questionTwo.question,

              optionA:
                questionTwo.optionA,

              optionB:
                questionTwo.optionB,

              optionC:
                questionTwo.optionC,

              optionD:
                questionTwo.optionD,

              correctAnswer:
                questionTwo.correctAnswer,

              explanation:
                questionTwo.explanation,

              marks:
                questionTwo.marks,
            },
          ],
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
                40 * 60 * 1000
            ),

          submittedAt:
            new Date(
              now.getTime() -
                5 * 60 * 1000
            ),

          status:
            "SUBMITTED",

          currentQuestionIndex: 1,

          visitedQuestions: [
            questionOne._id,
            questionTwo._id,
          ],

          reviewQuestions: [],

          totalQuestions: 2,

          totalMarks:
            questionOne.marks +
            questionTwo.marks,

          correctAnswers: 1,

          wrongAnswers: 1,

          unansweredQuestions: 0,

          obtainedMarks:
            questionOne.marks,

          percentage:
            Number(
              (
                (questionOne.marks /
                  (
                    questionOne.marks +
                    questionTwo.marks
                  )) *
                100
              ).toFixed(2)
            ),

          isPassed: true,

          timeTaken: 1800,
        });

      // -----------------------------------
      // Answer 1 → correct
      // -----------------------------------

      await StudentAnswer.create({
        attempt:
          submittedAttempt._id,

        questionId:
          questionOne._id,

        selectedAnswer:
          questionOne.correctAnswer,

        correctAnswer:
          questionOne.correctAnswer,

        isCorrect: true,

        marksAwarded:
          questionOne.marks,

        answeredAt:
          new Date(),
      });

      // -----------------------------------
      // Answer 2 → wrong
      // -----------------------------------

      const wrongAnswer =
        ["A", "B", "C", "D"].find(
          (value) =>
            value !==
            questionTwo.correctAnswer
        );

      await StudentAnswer.create({
        attempt:
          submittedAttempt._id,

        questionId:
          questionTwo._id,

        selectedAnswer:
          wrongAnswer,

        correctAnswer:
          questionTwo.correctAnswer,

        isCorrect: false,

        marksAwarded: 0,

        answeredAt:
          new Date(),
      });

      // -----------------------------------
      // Create in-progress attempt
      // -----------------------------------

      const inProgressSnapshot =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Unfinished Review Test",

          subject:
            "Physics",

          duration: 30,

          totalMarks: 5,

          totalQuestions: 1,

          startTime:
            new Date(
              now.getTime() -
                20 * 60 * 1000
            ),

          endTime:
            new Date(
              now.getTime() +
                30 * 60 * 1000
            ),

          questions: [],
        });

      inProgressAttempt =
        await ExamAttempt.create({
          student:
            student._id,

          testSnapshot:
            inProgressSnapshot._id,

          startedAt:
            new Date(
              now.getTime() -
                10 * 60 * 1000
            ),

          status:
            "IN-PROGRESS",

          totalQuestions: 1,

          totalMarks: 5,
        });
    });

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. SUCCESSFUL REVIEW
    // =====================================

    test(
      "Should return complete review data for a submitted exam",
      async () => {
        const review =
          await studentService.getReviewAnswers(
            student._id,
            submittedAttempt._id
          );

        expect(
          review
        ).toBeDefined();

        expect(
          review.attemptId.toString()
        ).toBe(
          submittedAttempt._id.toString()
        );

        expect(
          review.examTitle
        ).toBe(
          "Physics Review Test"
        );

        expect(
          review.subject
        ).toBe("Physics");

        expect(
          review.totalQuestions
        ).toBe(2);

        expect(
          review.questions
        ).toHaveLength(2);
      }
    );

    // =====================================
    // 2. QUESTION ORDER
    // =====================================

    test(
      "Should preserve snapshot question order",
      async () => {
        const review =
          await studentService.getReviewAnswers(
            student._id,
            submittedAttempt._id
          );

        expect(
          review.questions[0]
            .questionId.toString()
        ).toBe(
          questionOne._id.toString()
        );

        expect(
          review.questions[0]
            .questionNumber
        ).toBe(1);

        expect(
          review.questions[1]
            .questionId.toString()
        ).toBe(
          questionTwo._id.toString()
        );

        expect(
          review.questions[1]
            .questionNumber
        ).toBe(2);
      }
    );

    // =====================================
    // 3. ANSWER DETAILS
    // =====================================

    test(
      "Should return selected answer, correct answer and marks",
      async () => {
        const review =
          await studentService.getReviewAnswers(
            student._id,
            submittedAttempt._id
          );

        const first =
          review.questions[0];

        const second =
          review.questions[1];

        expect(
          first.selectedAnswer
        ).toBe(
          questionOne.correctAnswer
        );

        expect(
          first.correctAnswer
        ).toBe(
          questionOne.correctAnswer
        );

        expect(
          first.isCorrect
        ).toBe(true);

        expect(
          first.marksAwarded
        ).toBe(
          questionOne.marks
        );

        expect(
          second.selectedAnswer
        ).not.toBe(
          questionTwo.correctAnswer
        );

        expect(
          second.correctAnswer
        ).toBe(
          questionTwo.correctAnswer
        );

        expect(
          second.isCorrect
        ).toBe(false);

        expect(
          second.marksAwarded
        ).toBe(0);
      }
    );

    // =====================================
    // 4. RESULT SUMMARY
    // =====================================

    test(
      "Should return the finalized result summary with the review",
      async () => {
        const review =
          await studentService.getReviewAnswers(
            student._id,
            submittedAttempt._id
          );

        expect(
          review.obtainedMarks
        ).toBe(
          submittedAttempt.obtainedMarks
        );

        expect(
          review.totalMarks
        ).toBe(
          submittedAttempt.totalMarks
        );

        expect(
          review.percentage
        ).toBe(
          submittedAttempt.percentage
        );

        expect(
          review.status
        ).toBe("Pass");

        expect(
          review.timeTaken
        ).toBe(
          submittedAttempt.timeTaken
        );

        expect(
          review.submittedAt
        ).toBeDefined();
      }
    );

    // =====================================
    // 5. OWNERSHIP PROTECTION
    // =====================================

    test(
      "Should not allow another student to view the review",
      async () => {
        await expect(
          studentService.getReviewAnswers(
            otherStudent._id,
            submittedAttempt._id
          )
        ).rejects.toMatchObject({
          statusCode: 403,
          message:
            "You are not allowed to access this review.",
        });
      }
    );

    // =====================================
    // 6. IN-PROGRESS ATTEMPT
    // =====================================

    test(
      "Should reject review before exam submission",
      async () => {
        await expect(
          studentService.getReviewAnswers(
            student._id,
            inProgressAttempt._id
          )
        ).rejects.toMatchObject({
          statusCode: 400,
          message:
            "Please submit the exam first.",
        });
      }
    );

    // =====================================
    // 7. ATTEMPT NOT FOUND
    // =====================================

    test(
      "Should return 404 when exam attempt does not exist",
      async () => {
        const fakeAttemptId =
          new mongoose.Types.ObjectId();

        await expect(
          studentService.getReviewAnswers(
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
    // 8. SNAPSHOT NOT FOUND
    // =====================================

    test(
      "Should return 404 when the test snapshot is missing",
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

            totalQuestions: 1,

            totalMarks: 5,

            correctAnswers: 1,

            wrongAnswers: 0,

            unansweredQuestions: 0,

            obtainedMarks: 5,

            percentage: 100,

            isPassed: true,

            timeTaken: 900,
          });

        await expect(
          studentService.getReviewAnswers(
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