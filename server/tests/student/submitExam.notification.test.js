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

const NotificationPreference =
  require("../../models/NotificationPreference");

const studentService =
  require("../../services/student.service");
const notificationService =
  require("../../services/notification.service");

describe(
  "Submit Exam → Result Notification",
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
      // Create real question
      // -----------------------------------

      const createdQuestions =
        await createQuestions(
          admin._id
        );

      question =
        createdQuestions[0];

      // -----------------------------------
      // Create Test Snapshot
      // -----------------------------------

      const now = new Date();

      const startTime =
        new Date(
          now.getTime() -
            5 * 60 * 1000
        );

      const endTime =
        new Date(
          now.getTime() +
            60 * 60 * 1000
        );

      snapshot =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Physics Mock Test",

          subject:
            "Physics",

          duration: 60,

          totalMarks:
            question.marks,

          totalQuestions: 1,

          startTime,

          endTime,

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
    // 1. RESULT NOTIFICATION CREATED
    // =====================================

    test(
      "Should create RESULT notification after successful exam submission",
      async () => {
        const result =
          await studentService.submitExam(
            student._id,
            attempt._id
          );

        expect(
          result.status
        ).toBe("SUBMITTED");

        expect(
          result.percentage
        ).toBe(100);

        const notification =
          await Notification.findOne({
            student:
              student._id,

            type:
              "RESULT",
          }).lean();

        expect(
          notification
        ).not.toBeNull();

        expect(
          notification.title
        ).toBe("Result Declared");

        expect(
          notification.relatedModel
        ).toBe("ExamAttempt");

        expect(
          notification.relatedId.toString()
        ).toBe(
          attempt._id.toString()
        );

        expect(
          notification.actionUrl
        ).toBe(
          `/student/result/${attempt._id}`
        );

        expect(
          notification.isRead
        ).toBe(false);
      }
    );

    // =====================================
    // 2. PREFERENCE DISABLED
    // =====================================

    test(
      "Should not create RESULT notification when result notifications are disabled",
      async () => {
        await NotificationPreference.create({
          student:
            student._id,

          examNotifications:
            true,

          resultNotifications:
            false,

          announcementNotifications:
            true,
        });

        const result =
          await studentService.submitExam(
            student._id,
            attempt._id
          );

        expect(
          result.status
        ).toBe("SUBMITTED");

        const notificationCount =
          await Notification.countDocuments({
            student:
              student._id,

            type:
              "RESULT",
          });

        expect(
          notificationCount
        ).toBe(0);
      }
    );

    // =====================================
    // 3. NO DUPLICATE RESULT NOTIFICATION
    // =====================================

    test(
      "Should not create duplicate RESULT notification for the same exam attempt",
      async () => {
        const result =
          await studentService.submitExam(
            student._id,
            attempt._id
          );

        expect(
          result.status
        ).toBe("SUBMITTED");

        const firstCount =
          await Notification.countDocuments({
            student:
              student._id,

            type:
              "RESULT",

            relatedId:
              attempt._id,

            relatedModel:
              "ExamAttempt",
          });

        expect(
          firstCount
        ).toBe(1);

        // Re-create the same event through
        // the notification service using
        // the same related resource.
        const {
          createNotification,
        } =
          require(
            "../../services/notification.service"
          );

        await createNotification({
          studentId:
            student._id,

          type:
            "RESULT",

          title:
            "Result Declared",

          message:
            "Your result has been declared.",

          relatedId:
            attempt._id,

          relatedModel:
            "ExamAttempt",

          actionUrl:
            `/student/result/${attempt._id}`,
        });

        const finalCount =
          await Notification.countDocuments({
            student:
              student._id,

            type:
              "RESULT",

            relatedId:
              attempt._id,

            relatedModel:
              "ExamAttempt",
          });

        expect(
          finalCount
        ).toBe(1);
      }
    );
        // =====================================
    // 4. NOTIFICATION FAILURE ISOLATION
    // =====================================

    test(
      "Should still submit exam when result notification creation fails",
      async () => {
        const notificationService =
          require(
            "../../services/notification.service"
          );

        const originalCreateNotification =
          notificationService.createNotification;

        notificationService.createNotification =
          jest.fn().mockRejectedValue(
            new Error(
              "Notification service unavailable"
            )
          );

        const result =
          await studentService.submitExam(
            student._id,
            attempt._id
          );

        expect(
          result.status
        ).toBe("SUBMITTED");

        const submittedAttempt =
          await ExamAttempt.findById(
            attempt._id
          ).lean();

        expect(
          submittedAttempt.status
        ).toBe("SUBMITTED");

        // Restore the original function
        notificationService.createNotification =
          originalCreateNotification;
      }
    );
  }
);