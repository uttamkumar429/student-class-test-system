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
  "Resume Exam Service",
  () => {
    let student;
    let otherStudent;
    let admin;

    let questionOne;
    let questionTwo;

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
            "other-resume-student@test.com",
          phone:
            "9876543215",
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
    });

    // =====================================
    // HELPERS
    // =====================================

    const createSnapshot = async ({
      startTime,
      endTime,
      duration = 60,
      title = "Resume Physics Test",
    }) => {
      return TestSnapshot.create({
        testId:
          new mongoose.Types.ObjectId(),

        title,

        subject:
          "Physics",

        duration,

        totalMarks:
          Number(questionOne.marks) +
          Number(questionTwo.marks),

        totalQuestions: 2,

        startTime,

        endTime,

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
    };

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. RESUME ACTIVE ATTEMPT
    // =====================================

    test(
      "Should resume an active exam attempt",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
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
          });

        const attempt =
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

            currentQuestionIndex: 1,

            visitedQuestions: [
              questionOne._id,
            ],

            reviewQuestions: [
              questionTwo._id,
            ],

            totalQuestions: 2,

            totalMarks:
              snapshot.totalMarks,
          });

        const result =
          await studentService.resumeExam(
            student._id
          );

        expect(
          result.attemptId.toString()
        ).toBe(
          attempt._id.toString()
        );

        expect(
          result.testSnapshotId.toString()
        ).toBe(
          snapshot._id.toString()
        );

        expect(
          result.title
        ).toBe(
          "Resume Physics Test"
        );

        expect(
          result.subject
        ).toBe("Physics");

        expect(
          result.status
        ).toBe("IN-PROGRESS");

        expect(
          result.totalQuestions
        ).toBe(2);

        expect(
          result.totalMarks
        ).toBe(
          snapshot.totalMarks
        );

        expect(
          result.currentQuestionIndex
        ).toBe(1);

        expect(
          result.visitedQuestions.map(
            (id) => id.toString()
          )
        ).toContain(
          questionOne._id.toString()
        );

        expect(
          result.reviewQuestions.map(
            (id) => id.toString()
          )
        ).toContain(
          questionTwo._id.toString()
        );

        expect(
          result.remainingTime
        ).toBeGreaterThan(0);
      }
    );

    // =====================================
    // 2. RESTORE SAVED ANSWERS
    // =====================================

    test(
      "Should restore saved answers and answered question count",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
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
          });

        const attempt =
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

        await StudentAnswer.create({
          attempt:
            attempt._id,

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

        const result =
          await studentService.resumeExam(
            student._id
          );

        expect(
          result.selectedAnswers[
            questionOne._id.toString()
          ]
        ).toBe(
          questionOne.correctAnswer
        );

        expect(
          result.selectedAnswers[
            questionTwo._id.toString()
          ]
        ).toBeUndefined();

        expect(
          result.answeredQuestions
        ).toBe(1);
      }
    );

    // =====================================
    // 3. NO RUNNING ATTEMPT
    // =====================================

    test(
      "Should return 404 when the student has no running exam",
      async () => {
        await expect(
          studentService.resumeExam(
            student._id
          )
        ).rejects.toMatchObject({
          statusCode: 404,

          message:
            "No running exam found.",
        });
      }
    );

    // =====================================
    // 4. OWNERSHIP ISOLATION
    // =====================================

    test(
      "Should not expose another student's running exam",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
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
          });

        await ExamAttempt.create({
          student:
            otherStudent._id,

          testSnapshot:
            snapshot._id,

          startedAt:
            new Date(
              now.getTime() -
                5 * 60 * 1000
            ),

          status:
            "IN-PROGRESS",

          totalQuestions: 2,

          totalMarks:
            snapshot.totalMarks,
        });

        await expect(
          studentService.resumeExam(
            student._id
          )
        ).rejects.toMatchObject({
          statusCode: 404,

          message:
            "No running exam found.",
        });
      }
    );

    // =====================================
    // 5. AUTO-SUBMIT EXPIRED EXAM
    // =====================================

    test(
      "Should auto-submit an expired running exam",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
            startTime:
              new Date(
                now.getTime() -
                  2 * 60 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() -
                  30 * 60 * 1000
              ),

            duration: 30,

            title:
              "Expired Physics Test",
          });

        const attempt =
          await ExamAttempt.create({
            student:
              student._id,

            testSnapshot:
              snapshot._id,

            startedAt:
              new Date(
                now.getTime() -
                  90 * 60 * 1000
              ),

            status:
              "IN-PROGRESS",

            totalQuestions: 2,

            totalMarks:
              snapshot.totalMarks,
          });

        await expect(
          studentService.resumeExam(
            student._id
          )
        ).rejects.toMatchObject({
          statusCode: 409,

          message:
            "Exam time is over. Your exam has been submitted automatically.",
        });

        const submittedAttempt =
          await ExamAttempt.findById(
            attempt._id
          ).lean();

        expect(
          submittedAttempt.status
        ).toBe("SUBMITTED");

        expect(
          submittedAttempt.submittedAt
        ).toBeDefined();
      }
    );

    // =====================================
    // 6. SNAPSHOT MISSING
    // =====================================

    test(
      "Should return 404 when the running attempt snapshot is missing",
      async () => {
        await ExamAttempt.create({
          student:
            student._id,

          testSnapshot:
            new mongoose.Types.ObjectId(),

          startedAt:
            new Date(
              Date.now() -
                5 * 60 * 1000
            ),

          status:
            "IN-PROGRESS",

          totalQuestions: 2,

          totalMarks: 10,
        });

        await expect(
          studentService.resumeExam(
            student._id
          )
        ).rejects.toMatchObject({
          statusCode: 404,

          message:
            "Test snapshot not found.",
        });
      }
    );

    // =====================================
    // 7. EXPIRED ATTEMPT DOES NOT STAY RUNNING
    // =====================================

    test(
      "Should not leave an expired attempt in IN-PROGRESS state",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
            startTime:
              new Date(
                now.getTime() -
                  2 * 60 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() -
                  20 * 60 * 1000
              ),

            duration: 20,

            title:
              "Expired Resume Test",
          });

        const attempt =
          await ExamAttempt.create({
            student:
              student._id,

            testSnapshot:
              snapshot._id,

            startedAt:
              new Date(
                now.getTime() -
                  90 * 60 * 1000
              ),

            status:
              "IN-PROGRESS",

            totalQuestions: 2,

            totalMarks:
              snapshot.totalMarks,
          });

        try {
          await studentService.resumeExam(
            student._id
          );
        } catch (error) {
          expect(
            error.statusCode
          ).toBe(409);
        }

        const finalAttempt =
          await ExamAttempt.findById(
            attempt._id
          ).lean();

        expect(
          finalAttempt.status
        ).toBe("SUBMITTED");
      }
    );
  }
);