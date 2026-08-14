const mongoose = require("mongoose");

const cleanup = require("../helpers/cleanup");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");

const Notification =
  require("../../models/Notification");

const NotificationPreference =
  require("../../models/NotificationPreference");

const {
  createNotification,
  getStudentNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../../services/notification.service");

describe(
  "Notification Service",
  () => {
    let student;

    // ==================================
    // SETUP
    // ==================================

    beforeEach(async () => {
      await cleanup();

      student =
        await createUser(
          users.student
        );

      // Predictable notification preferences
      await NotificationPreference.create({
        student: student._id,

        examNotifications: true,

        resultNotifications: true,

        announcementNotifications: false,
      });
    });

    // ==================================
    // CLOSE DATABASE
    // ==================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // ==================================
    // CREATE EXAM NOTIFICATION
    // ==================================

    test(
      "Should create exam notification when preference is enabled",
      async () => {
        const notification =
          await createNotification({
            studentId: student._id,

            type: "EXAM",

            title:
              "Java Programming Exam Published",

            message:
              "Your Java Programming examination is now available.",
          });

        expect(
          notification
        ).not.toBeNull();

        expect(
          notification.student.toString()
        ).toBe(
          student._id.toString()
        );

        expect(
          notification.type
        ).toBe("EXAM");

        expect(
          notification.isRead
        ).toBe(false);

        const stored =
          await Notification.findOne({
            student:
              student._id,
          }).lean();

        expect(
          stored
        ).not.toBeNull();
      }
    );

    // ==================================
    // BLOCK DISABLED NOTIFICATION
    // ==================================

    test(
      "Should not create announcement notification when preference is disabled",
      async () => {
        const notification =
          await createNotification({
            studentId:
              student._id,

            type:
              "ANNOUNCEMENT",

            title:
              "System Announcement",

            message:
              "This announcement should be blocked.",
          });

        expect(
          notification
        ).toBeNull();

        const count =
          await Notification.countDocuments({
            student:
              student._id,
          });

        expect(
          count
        ).toBe(0);
      }
    );

    // ==================================
    // GET NOTIFICATIONS
    // ==================================

    test(
      "Should fetch student notifications",
      async () => {
        await createNotification({
          studentId:
            student._id,

          type:
            "EXAM",

          title:
            "Exam Notification",

          message:
            "Exam is available.",
        });

        const result =
          await getStudentNotifications(
            student._id
          );

        expect(
          result.notifications
        ).toHaveLength(1);

        expect(
          result.pagination.total
        ).toBe(1);

        expect(
          result.notifications[0].title
        ).toBe(
          "Exam Notification"
        );
      }
    );

    // ==================================
    // UNREAD COUNT
    // ==================================

    test(
      "Should return unread notification count",
      async () => {
        await createNotification({
          studentId:
            student._id,

          type:
            "EXAM",

          title:
            "Exam Notification",

          message:
            "Exam is available.",
        });

        const count =
          await getUnreadCount(
            student._id
          );

        expect(
          count
        ).toBe(1);
      }
    );

    // ==================================
    // MARK ONE AS READ
    // ==================================

    test(
      "Should mark notification as read",
      async () => {
        const notification =
          await createNotification({
            studentId:
              student._id,

            type:
              "EXAM",

            title:
              "Exam Notification",

            message:
              "Exam is available.",
          });

        expect(
          notification
        ).not.toBeNull();

        const updated =
          await markNotificationAsRead(
            student._id,
            notification._id
          );

        expect(
          updated.isRead
        ).toBe(true);

        const count =
          await getUnreadCount(
            student._id
          );

        expect(
          count
        ).toBe(0);
      }
    );

    // ==================================
    // MARK ALL AS READ
    // ==================================

    test(
      "Should mark all student notifications as read",
      async () => {
        await createNotification({
          studentId:
            student._id,

          type:
            "EXAM",

          title:
            "Exam 1",

          message:
            "Exam 1 available.",
        });

        await createNotification({
          studentId:
            student._id,

          type:
            "RESULT",

          title:
            "Result 1",

          message:
            "Result published.",
        });

        const beforeCount =
          await getUnreadCount(
            student._id
          );

        expect(
          beforeCount
        ).toBe(2);

        const result =
          await markAllNotificationsAsRead(
            student._id
          );

        expect(
          result.modifiedCount
        ).toBe(2);

        const afterCount =
          await getUnreadCount(
            student._id
          );

        expect(
          afterCount
        ).toBe(0);
      }
    );

    // ==================================
    // STUDENT OWNERSHIP
    // ==================================

    test(
      "Should not allow one student to mark another student's notification as read",
      async () => {
        const notification =
          await createNotification({
            studentId:
              student._id,

            type:
              "EXAM",

            title:
              "Private Exam Notification",

            message:
              "Student-specific notification.",
          });

        expect(
          notification
        ).not.toBeNull();

        const otherStudent =
          await createUser({
            ...users.student,

            email:
              "other-student@test.com",

            phone:
              "9876543211",
          });

        await expect(
          markNotificationAsRead(
            otherStudent._id,
            notification._id
          )
        ).rejects.toMatchObject({
          statusCode: 404,
        });
      }
    );

    // ==================================
    // DUPLICATE NOTIFICATION PREVENTION
    // ==================================

    test(
      "Should not create duplicate notifications for the same event",
      async () => {
        await NotificationPreference.updateOne(
        {
            student: student._id,
        },
        {
            $set: {
            announcementNotifications: true,
            },
        }
        );
        const relatedId =
          new mongoose.Types.ObjectId();

        const first =
          await createNotification({
            studentId:
              student._id,

            type:
              "ANNOUNCEMENT",

            title:
              "Java Programming Exam Published",

            message:
              "Java Programming examination is available.",

            relatedId,

            relatedModel:
              "Announcement",
          });

        const second =
          await createNotification({
            studentId:
              student._id,

            type:
              "ANNOUNCEMENT",

            title:
              "Java Programming Exam Published",

            message:
              "Java Programming examination is available.",

            relatedId,

            relatedModel:
              "Announcement",
          });

        expect(
          first
        ).not.toBeNull();

        expect(
          second
        ).not.toBeNull();

        expect(
          first._id.toString()
        ).toBe(
          second._id.toString()
        );

        const count =
          await Notification.countDocuments({
            student:
              student._id,

            type:
              "ANNOUNCEMENT",

            relatedId,
          });

        expect(
          count
        ).toBe(1);
      }
    );
  }
);