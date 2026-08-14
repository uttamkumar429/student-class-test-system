const request = require("supertest");

const app = require("../../app");

const User = require("../../models/User");
const Notification =
  require("../../models/Notification");
const NotificationPreference =
  require("../../models/NotificationPreference");

const cleanup = require("../helpers/cleanup");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");

const {
  createNotification,
} = require("../../services/notification.service");

describe(
  "Notification Routes",
  () => {
    let student;
    let studentToken;
    let adminToken;
    let notification;

    beforeEach(async () => {
      await cleanup();

      // --------------------------------
      // Create student
      // --------------------------------

      await createUser(
        users.student
      );

      student = await User.findOne({
        email:
          users.student.email.toLowerCase(),
      });

      // --------------------------------
      // Student login
      // --------------------------------

      const studentLogin =
        await request(app)
          .post("/api/auth/login")
          .send({
            emailOrPhone:
              users.student.email,
            password:
              users.student.password,
          });

      studentToken =
        studentLogin.body.token;

      // --------------------------------
      // Create admin
      // --------------------------------

      await createUser(
        users.admin
      );

      const adminLogin =
        await request(app)
          .post("/api/auth/admin/login")
          .send({
            emailOrPhone:
              users.admin.email,
            password:
              users.admin.password,
          });

      adminToken =
        adminLogin.body.token;

      // --------------------------------
      // Notification preferences
      // --------------------------------

      await NotificationPreference.create({
        student: student._id,
        examNotifications: true,
        resultNotifications: true,
        announcementNotifications: true,
      });

      // --------------------------------
      // Seed notification
      // --------------------------------

      notification =
        await createNotification({
          studentId: student._id,
          type: "EXAM",
          title:
            "Java Programming Exam Published",
          message:
            "Your Java Programming examination is now available.",
        });
    });

    // =================================
    // GET NOTIFICATIONS
    // =================================

    test(
      "Student should fetch notifications",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/student/notifications"
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.data.notifications
        ).toHaveLength(1);

        expect(
          response.body.data.notifications[0]
            .title
        ).toBe(
          "Java Programming Exam Published"
        );
      }
    );

    // =================================
    // GET UNREAD COUNT
    // =================================

    test(
      "Student should fetch unread count",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/student/notifications/unread-count"
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.data.count
        ).toBe(1);
      }
    );

    // =================================
    // MARK ONE AS READ
    // =================================

    test(
      "Student should mark own notification as read",
      async () => {
        const response =
          await request(app)
            .patch(
              `/api/student/notifications/${notification._id}/read`
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.data.isRead
        ).toBe(true);

        const countResponse =
          await request(app)
            .get(
              "/api/student/notifications/unread-count"
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          countResponse.body.data.count
        ).toBe(0);
      }
    );

    // =================================
    // MARK ALL AS READ
    // =================================

    test(
      "Student should mark all notifications as read",
      async () => {
        await createNotification({
          studentId: student._id,
          type: "RESULT",
          title:
            "Result Published",
          message:
            "Your result has been published.",
        });

        const response =
          await request(app)
            .patch(
              "/api/student/notifications/read-all"
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          response.statusCode
        ).toBe(200);

        expect(
          response.body.success
        ).toBe(true);

        expect(
          response.body.data.modifiedCount
        ).toBe(2);

        const countResponse =
          await request(app)
            .get(
              "/api/student/notifications/unread-count"
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          countResponse.body.data.count
        ).toBe(0);
      }
    );

    // =================================
    // NO TOKEN
    // =================================

    test(
      "Should reject notifications request without token",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/student/notifications"
            );

        expect(
          response.statusCode
        ).toBe(401);

        expect(
          response.body.success
        ).toBe(false);
      }
    );

    // =================================
    // ADMIN ACCESS
    // =================================

    test(
      "Admin should not access student notifications",
      async () => {
        const response =
          await request(app)
            .get(
              "/api/student/notifications"
            )
            .set(
              "Authorization",
              `Bearer ${adminToken}`
            );

        expect(
          response.statusCode
        ).toBe(403);

        expect(
          response.body.success
        ).toBe(false);
      }
    );

    // =================================
    // INVALID NOTIFICATION ID
    // =================================

    test(
      "Should reject invalid notification ID",
      async () => {
        const response =
          await request(app)
            .patch(
              "/api/student/notifications/invalid-id/read"
            )
            .set(
              "Authorization",
              `Bearer ${studentToken}`
            );

        expect(
          response.statusCode
        ).toBeGreaterThanOrEqual(400);

        expect(
          response.body.success
        ).toBe(false);
      }
    );

    // =================================
    // CROSS-STUDENT ACCESS
    // =================================

    test(
      "Student should not mark another student's notification as read",
      async () => {
        await createUser({
          ...users.student,
          email:
            "another-student@test.com",
          phone:
            "9876543211",
        });

        const secondLogin =
          await request(app)
            .post("/api/auth/login")
            .send({
              emailOrPhone:
                "another-student@test.com",
              password:
                users.student.password,
            });

        const secondStudentToken =
          secondLogin.body.token;

        const response =
          await request(app)
            .patch(
              `/api/student/notifications/${notification._id}/read`
            )
            .set(
              "Authorization",
              `Bearer ${secondStudentToken}`
            );

        expect(
          response.statusCode
        ).toBe(404);

        expect(
          response.body.success
        ).toBe(false);

        const stored =
          await Notification.findById(
            notification._id
          ).lean();

        expect(
          stored.isRead
        ).toBe(false);
      }
    );
  }
);