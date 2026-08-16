const mongoose = require("mongoose");

const cleanup = require("../helpers/cleanup");
const createUser = require("../helpers/createUser");
const createQuestions = require("../helpers/createQuestions");

const users = require("../fixtures/users");

const ExamAttempt =
  require("../../models/ExamAttempt");

const TestSnapshot =
  require("../../models/TestSnapshot");

const studentService =
  require("../../services/student.service");

describe(
  "Start Exam Service",
  () => {
    let student;
    let admin;
    let questions;

    // =====================================
    // HELPERS
    // =====================================

    const createSnapshot = async ({
      startTime,
      endTime,
      duration = 60,
      totalMarks = 10,
      totalQuestions = 2,
      questionDocuments = questions,
      title = "Physics Mock Test",
      subject = "Physics",
    }) => {
      return TestSnapshot.create({
        testId:
          new mongoose.Types.ObjectId(),

        title,
        subject,
        duration,
        totalMarks,
        totalQuestions,
        startTime,
        endTime,

        questions:
          questionDocuments.map(
            (question) => ({
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
            })
          ),
      });
    };

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
      // Create real questions
      // -----------------------------------

      questions =
        await createQuestions(
          admin._id
        );

      questions =
        questions.slice(0, 2);
    });

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. CREATE NEW ATTEMPT
    // =====================================

    test(
      "Should create a new exam attempt for an active exam",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
            startTime:
              new Date(
                now.getTime() -
                  5 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() +
                  60 * 60 * 1000
              ),

            totalMarks:
              questions.reduce(
                (total, question) =>
                  total +
                  Number(
                    question.marks || 0
                  ),
                0
              ),
          });

        const result =
          await studentService.startExam(
            student._id,
            snapshot._id
          );

        expect(
          result
        ).toBeDefined();

        expect(
          result.status
        ).toBe("IN-PROGRESS");

        expect(
          result.attemptId
        ).toBeDefined();

        expect(
          result.testSnapshotId.toString()
        ).toBe(
          snapshot._id.toString()
        );

        expect(
          result.title
        ).toBe("Physics Mock Test");

        expect(
          result.subject
        ).toBe("Physics");

        expect(
          result.totalQuestions
        ).toBe(2);

        const storedAttempt =
          await ExamAttempt.findById(
            result.attemptId
          ).lean();

        expect(
          storedAttempt
        ).not.toBeNull();

        expect(
          storedAttempt.student.toString()
        ).toBe(
          student._id.toString()
        );

        expect(
          storedAttempt.testSnapshot.toString()
        ).toBe(
          snapshot._id.toString()
        );

        expect(
          storedAttempt.status
        ).toBe("IN-PROGRESS");
      }
    );

    // =====================================
    // 2. RESUME EXISTING ATTEMPT
    // =====================================

    test(
      "Should return the existing in-progress attempt instead of creating a duplicate",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
            startTime:
              new Date(
                now.getTime() -
                  5 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() +
                  60 * 60 * 1000
              ),
          });

        const first =
          await studentService.startExam(
            student._id,
            snapshot._id
          );

        const second =
          await studentService.startExam(
            student._id,
            snapshot._id
          );

        expect(
          second.attemptId.toString()
        ).toBe(
          first.attemptId.toString()
        );

        const count =
          await ExamAttempt.countDocuments({
            student:
              student._id,

            testSnapshot:
              snapshot._id,
          });

        expect(
          count
        ).toBe(1);

        expect(
          second.status
        ).toBe("IN-PROGRESS");
      }
    );

    // =====================================
    // 3. REJECT SUBMITTED ATTEMPT
    // =====================================

    test(
      "Should reject starting an already submitted exam",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
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
          });

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
            new Date(),

          status:
            "SUBMITTED",

          totalQuestions: 2,

          totalMarks:
            snapshot.totalMarks,
        });

        await expect(
          studentService.startExam(
            student._id,
            snapshot._id
          )
        ).rejects.toMatchObject({
          statusCode: 409,
        });
      }
    );

    // =====================================
    // 4. EXAM NOT STARTED
    // =====================================

    test(
      "Should reject an exam that has not started",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
            startTime:
              new Date(
                now.getTime() +
                  30 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() +
                  2 * 60 * 60 * 1000
              ),
          });

        await expect(
          studentService.startExam(
            student._id,
            snapshot._id
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "Exam has not started yet.",
        });
      }
    );

    // =====================================
    // 5. EXAM ALREADY ENDED
    // =====================================

    test(
      "Should reject an exam that has already ended",
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
          });

        await expect(
          studentService.startExam(
            student._id,
            snapshot._id
          )
        ).rejects.toMatchObject({
          statusCode: 409,

          message:
            "Exam has already ended.",
        });
      }
    );

    // =====================================
    // 6. EXAM WITH NO QUESTIONS
    // =====================================

    test(
      "Should reject an exam without questions",
      async () => {
        const now =
          new Date();

        const snapshot =
          await TestSnapshot.create({
            testId:
              new mongoose.Types.ObjectId(),

            title:
              "Empty Test",

            subject:
              "Physics",

            duration: 60,

            totalMarks: 0,

            totalQuestions: 0,

            startTime:
              new Date(
                now.getTime() -
                  5 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() +
                  60 * 60 * 1000
              ),

            questions: [],
          });

        await expect(
          studentService.startExam(
            student._id,
            snapshot._id
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "This exam has no questions.",
        });
      }
    );

    // =====================================
    // 7. INVALID STUDENT ID
    // =====================================

    test(
      "Should reject an invalid student ID",
      async () => {
        const now =
          new Date();

        const snapshot =
          await createSnapshot({
            startTime:
              new Date(
                now.getTime() -
                  5 * 60 * 1000
              ),

            endTime:
              new Date(
                now.getTime() +
                  60 * 60 * 1000
              ),
          });

        await expect(
          studentService.startExam(
            "invalid-student-id",
            snapshot._id
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "Invalid student ID.",
        });
      }
    );

    // =====================================
    // 8. INVALID SNAPSHOT ID
    // =====================================

    test(
      "Should reject an invalid exam ID",
      async () => {
        await expect(
          studentService.startExam(
            student._id,
            "invalid-exam-id"
          )
        ).rejects.toMatchObject({
          statusCode: 400,

          message:
            "Invalid exam ID.",
        });
      }
    );

    // =====================================
    // 9. SNAPSHOT NOT FOUND
    // =====================================

    test(
      "Should return 404 when the exam snapshot does not exist",
      async () => {
        const fakeSnapshotId =
          new mongoose.Types.ObjectId();

        await expect(
          studentService.startExam(
            student._id,
            fakeSnapshotId
          )
        ).rejects.toMatchObject({
          statusCode: 404,

          message:
            "Test not found.",
        });
      }
    );
  }
);