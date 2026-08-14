const mongoose = require("mongoose");

const cleanup = require("../helpers/cleanup");
const createUser = require("../helpers/createUser");

const users = require("../fixtures/users");

const User = require("../../models/User");
const Announcement = require("../../models/Announcement");
const Notification =
  require("../../models/Notification");
const NotificationPreference =
  require("../../models/NotificationPreference");

const {
  publishAnnouncement,
} = require("../../services/announcement.service");

describe(
  "Announcement Notification Integration",
  () => {
    let admin;
    let student;
    let announcement;

    beforeEach(async () => {
      await cleanup();

      // =================================
      // CREATE ADMIN
      // =================================

      await createUser(users.admin);

      admin = await User.findOne({
        email:
          users.admin.email.toLowerCase(),
      });

      // =================================
      // CREATE STUDENT
      // =================================

      await createUser(users.student);

      student = await User.findOne({
        email:
          users.student.email.toLowerCase(),
      });

      // =================================
      // DEFAULT STUDENT PREFERENCE
      // =================================

      await NotificationPreference.create({
        student: student._id,

        examNotifications: true,

        resultNotifications: true,

        announcementNotifications: true,
      });

      // =================================
      // CREATE DRAFT ANNOUNCEMENT
      // =================================

      announcement =
        await Announcement.create({
          title:
            "Java Programming Exam Published",

          description:
            "The Java Programming examination is now available for students.",

          type: "exam",

          isPublished: false,

          publishedAt: null,

          expiresAt: null,

          createdBy: admin._id,
        });
    });

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =================================
    // PUBLISH → CREATE NOTIFICATION
    // =================================

    test(
      "Should create student notification when announcement is published",
      async () => {
        const result =
          await publishAnnouncement(
            announcement._id
          );

        // --------------------------------
        // Announcement published
        // --------------------------------

        expect(
          result.isPublished
        ).toBe(true);

        expect(
          result.publishedAt
        ).not.toBeNull();

        // --------------------------------
        // Notification created
        // --------------------------------

        const notification =
          await Notification.findOne({
            student: student._id,
            relatedId:
              announcement._id,
            type: "ANNOUNCEMENT",
          }).lean();

        expect(
          notification
        ).not.toBeNull();

        expect(
          notification.title
        ).toBe(
          "Java Programming Exam Published"
        );

        expect(
          notification.message
        ).toBe(
          "The Java Programming examination is now available for students."
        );

        expect(
          notification.isRead
        ).toBe(false);

        expect(
          notification.relatedModel
        ).toBe("Announcement");
      }
    );

    // =================================
    // PREFERENCE OFF → NO NOTIFICATION
    // =================================

    test(
      "Should not create notification when announcement notifications are disabled",
      async () => {
        await NotificationPreference.updateOne(
          {
            student: student._id,
          },
          {
            $set: {
              announcementNotifications:
                false,
            },
          }
        );

        await publishAnnouncement(
          announcement._id
        );

        const notificationCount =
          await Notification.countDocuments({
            student: student._id,
            relatedId:
              announcement._id,
            type: "ANNOUNCEMENT",
          });

        expect(
          notificationCount
        ).toBe(0);
      }
    );

    // =================================
    // BLOCKED STUDENT SHOULD NOT
    // RECEIVE NOTIFICATION
    // =================================

    test(
      "Should not create notification for blocked students",
      async () => {
        await User.updateOne(
          {
            _id: student._id,
          },
          {
            $set: {
              isBlocked: true,
            },
          }
        );

        await publishAnnouncement(
          announcement._id
        );

        const notification =
          await Notification.findOne({
            student: student._id,
            relatedId:
              announcement._id,
          }).lean();

        expect(
          notification
        ).toBeNull();
      }
    );

    // =================================
    // DRAFT SHOULD NOT TRIGGER
    // =================================

    test(
      "Creating a draft should not create notification",
      async () => {
        const notificationCount =
          await Notification.countDocuments({
            student: student._id,
            relatedId:
              announcement._id,
            type: "ANNOUNCEMENT",
          });

        expect(
          announcement.isPublished
        ).toBe(false);

        expect(
          notificationCount
        ).toBe(0);
      }
    );

    // =================================
    // EXPIRED ANNOUNCEMENT
    // =================================

    test(
      "Should reject publishing an expired announcement",
      async () => {
        const expiredAnnouncement =
          await Announcement.create({
            title:
              "Expired Announcement",

            description:
              "This announcement has expired.",

            type: "warning",

            isPublished: false,

            expiresAt:
              new Date(
                Date.now() - 60 * 1000
              ),

            createdBy: admin._id,
          });

        await expect(
          publishAnnouncement(
            expiredAnnouncement._id
          )
        ).rejects.toMatchObject({
          statusCode: 400,
        });

        const notificationCount =
          await Notification.countDocuments({
            student: student._id,
            relatedId:
              expiredAnnouncement._id,
          });

        expect(
          notificationCount
        ).toBe(0);
      }
    );
  }
);