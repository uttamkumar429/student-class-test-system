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
  "Save Answer Service",
  () => {
    let student;
    let otherStudent;
    let admin;

    let questionOne;
    let questionTwo;
    let unrelatedQuestion;

    let snapshot;
    let attempt;

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
            "other-answer-student@test.com",
          phone:
            "9876543214",
        });

      // -----------------------------------
      // Create admin
      // -----------------------------------

      admin =
        await createUser({
          ...users.admin,
        });

      // -----------------------------------
      // Create real questions
      // -----------------------------------

      const questions =
        await createQuestions(
          admin._id
        );

      questionOne =
        questions[0];

      questionTwo =
        questions[1];

      unrelatedQuestion =
        questions[2];

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
            "Physics Answer Test",

          subject:
            "Physics",

          duration: 60,

          totalMarks:
            Number(questionOne.marks) +
            Number(questionTwo.marks),

          totalQuestions: 2,

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
                5 * 60 * 1000
            ),

          status:
            "IN-PROGRESS",

          currentQuestionIndex: 0,

          visitedQuestions: [],

          reviewQuestions: [],

          totalQuestions: 2,

          totalMarks:
            snapshot.totalMarks,
        });
    });

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. SAVE CORRECT ANSWER
    // =====================================

    test(
      "Should save a correct answer successfully",
      async () => {
        const result =
          await studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            questionOne.correctAnswer,
            0
          );

        expect(
          result
        ).toBeDefined();

        expect(
          result.selectedAnswer
        ).toBe(
          questionOne.correctAnswer
        );

        expect(
          result.isCorrect
        ).toBe(true);

        expect(
          result.marksAwarded
        ).toBe(
          questionOne.marks
        );

        const saved =
          await StudentAnswer.findOne({
            attempt:
              attempt._id,

            questionId:
              questionOne._id,
          }).lean();

        expect(
          saved
        ).not.toBeNull();

        expect(
          saved.selectedAnswer
        ).toBe(
          questionOne.correctAnswer
        );

        expect(
          saved.isCorrect
        ).toBe(true);

        expect(
          saved.marksAwarded
        ).toBe(
          questionOne.marks
        );
      }
    );

    // =====================================
    // 2. SAVE WRONG ANSWER
    // =====================================

    test(
      "Should save a wrong answer with zero marks",
      async () => {
        const wrongAnswer =
          ["A", "B", "C", "D"].find(
            (value) =>
              value !==
              questionOne.correctAnswer
          );

        const result =
          await studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            wrongAnswer,
            0
          );

        expect(
          result.selectedAnswer
        ).toBe(wrongAnswer);

        expect(
          result.isCorrect
        ).toBe(false);

        expect(
          result.marksAwarded
        ).toBe(0);

        const saved =
          await StudentAnswer.findOne({
            attempt:
              attempt._id,

            questionId:
              questionOne._id,
          }).lean();

        expect(
          saved.isCorrect
        ).toBe(false);

        expect(
          saved.marksAwarded
        ).toBe(0);
      }
    );

    // =====================================
    // 3. SAVE UNANSWERED STATE
    // =====================================

    test(
      "Should save null as unanswered state",
      async () => {
        const result =
          await studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            null,
            0
          );

        expect(
          result.selectedAnswer
        ).toBeNull();

        expect(
          result.isCorrect
        ).toBe(false);

        expect(
          result.marksAwarded
        ).toBe(0);

        const saved =
          await StudentAnswer.findOne({
            attempt:
              attempt._id,

            questionId:
              questionOne._id,
          }).lean();

        expect(
          saved
        ).not.toBeNull();

        expect(
          saved.selectedAnswer
        ).toBeNull();

        expect(
          saved.isCorrect
        ).toBe(false);

        expect(
          saved.marksAwarded
        ).toBe(0);
      }
    );

    // =====================================
    // 4. UPDATE EXISTING ANSWER
    // =====================================

    test(
      "Should update an existing answer instead of creating a duplicate",
      async () => {
        await studentService.saveAnswer(
          student._id,
          attempt._id,
          questionOne._id,
          questionOne.correctAnswer,
          0
        );

        const updated =
          await studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            null,
            0
          );

        expect(
          updated.selectedAnswer
        ).toBeNull();

        expect(
          updated.isCorrect
        ).toBe(false);

        expect(
          updated.marksAwarded
        ).toBe(0);

        const answers =
          await StudentAnswer.find({
            attempt:
              attempt._id,

            questionId:
              questionOne._id,
          }).lean();

        expect(
          answers
        ).toHaveLength(1);
      }
    );

    // =====================================
    // 5. UPDATE CURRENT PROGRESS
    // =====================================

test(
  "Should update current question index and visited questions",
  async () => {
    const result =
      await studentService.saveAnswer(
        student._id,
        attempt._id,
        questionTwo._id,
        questionTwo.correctAnswer,
        1
      );

    expect(
      result.selectedAnswer
    ).toBe(
      questionTwo.correctAnswer
    );

    expect(
      result.isCorrect
    ).toBe(true);

    expect(
      result.marksAwarded
    ).toBe(
      questionTwo.marks
    );

    const storedAttempt =
      await ExamAttempt.findById(
        attempt._id
      ).lean();

    expect(
      storedAttempt.currentQuestionIndex
    ).toBe(1);

    expect(
      storedAttempt.visitedQuestions.map(
        (id) => id.toString()
      )
    ).toContain(
      questionTwo._id.toString()
    );
  }
);
    // =====================================
    // 6. INVALID QUESTION INDEX
    // =====================================

    test(
      "Should reject an invalid question index",
      async () => {
        await expect(
          studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            questionOne.correctAnswer,
            99
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "Invalid question index.",
        });
      }
    );

    // =====================================
    // 7. INVALID QUESTION ID
    // =====================================

    test(
      "Should reject an invalid question ID",
      async () => {
        await expect(
          studentService.saveAnswer(
            student._id,
            attempt._id,
            "invalid-question-id",
            "A",
            0
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "Invalid question ID.",
        });
      }
    );

    // =====================================
    // 8. INVALID SELECTED ANSWER
    // =====================================

    test(
      "Should reject an invalid selected answer",
      async () => {
        await expect(
          studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            "X",
            0
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "Invalid selected answer.",
        });
      }
    );

    // =====================================
    // 9. QUESTION NOT IN EXAM
    // =====================================

    test(
      "Should reject a question that does not belong to the exam",
      async () => {
        await expect(
          studentService.saveAnswer(
            student._id,
            attempt._id,
            unrelatedQuestion._id,
            unrelatedQuestion.correctAnswer,
            0
          )
        ).rejects.toMatchObject({
          statusCode: 404,

          message:
            "Question not found in this exam.",
        });
      }
    );

    // =====================================
    // 10. OWNERSHIP PROTECTION
    // =====================================

    test(
      "Should not allow another student to save an answer",
      async () => {
        await expect(
          studentService.saveAnswer(
            otherStudent._id,
            attempt._id,
            questionOne._id,
            questionOne.correctAnswer,
            0
          )
        ).rejects.toMatchObject({
          statusCode: 403,

          message:
            "You are not allowed to access this exam.",
        });
      }
    );

    // =====================================
    // 11. SUBMITTED ATTEMPT PROTECTION
    // =====================================

    test(
      "Should reject saving an answer after exam submission",
      async () => {
        await ExamAttempt.findByIdAndUpdate(
          attempt._id,
          {
            $set: {
              status:
                "SUBMITTED",

              submittedAt:
                new Date(),
            },
          }
        );

        await expect(
          studentService.saveAnswer(
            student._id,
            attempt._id,
            questionOne._id,
            questionOne.correctAnswer,
            0
          )
        ).rejects.toMatchObject({
          statusCode: 409,

          message:
            "Exam already submitted.",
        });
      }
    );

    // =====================================
    // 12. ATTEMPT NOT FOUND
    // =====================================

    test(
      "Should return 404 when the exam attempt does not exist",
      async () => {
        const fakeAttemptId =
          new mongoose.Types.ObjectId();

        await expect(
          studentService.saveAnswer(
            student._id,
            fakeAttemptId,
            questionOne._id,
            questionOne.correctAnswer,
            0
          )
        ).rejects.toMatchObject({
          statusCode: 404,

          message:
            "Exam attempt not found.",
        });
      }
    );
  }
);