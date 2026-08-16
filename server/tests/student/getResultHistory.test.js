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
  "Get Result History Service",
  () => {
    let student;
    let otherStudent;

    let snapshotOne;
    let snapshotTwo;
    let snapshotInProgress;

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

      const now = new Date();

      // -----------------------------------
      // Create first snapshot
      // -----------------------------------

      snapshotOne =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Physics Mock Test",

          subject:
            "Physics",

          duration: 60,

          totalMarks: 10,

          totalQuestions: 5,

          startTime:
            new Date(
              now.getTime() -
                3 * 60 * 60 * 1000
            ),

          endTime:
            new Date(
              now.getTime() +
                60 * 60 * 1000
            ),

          questions: [],
        });

      // -----------------------------------
      // Create second snapshot
      // -----------------------------------

      snapshotTwo =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Data Structures Test",

          subject:
            "Computer Science",

          duration: 45,

          totalMarks: 20,

          totalQuestions: 10,

          startTime:
            new Date(
              now.getTime() -
                2 * 60 * 60 * 1000
            ),

          endTime:
            new Date(
              now.getTime() +
                60 * 60 * 1000
            ),

          questions: [],
        });

      // -----------------------------------
      // Create in-progress snapshot
      // -----------------------------------

      snapshotInProgress =
        await TestSnapshot.create({
          testId:
            new mongoose.Types.ObjectId(),

          title:
            "Unfinished Test",

          subject:
            "Mathematics",

          duration: 30,

          totalMarks: 15,

          totalQuestions: 5,

          startTime:
            new Date(
              now.getTime() -
                30 * 60 * 1000
            ),

          endTime:
            new Date(
              now.getTime() +
                30 * 60 * 1000
            ),

          questions: [],
        });

      // -----------------------------------
      // First submitted result
      // -----------------------------------

      await ExamAttempt.create({
        student:
          student._id,

        testSnapshot:
          snapshotOne._id,

        startedAt:
          new Date(
            now.getTime() -
              2 * 60 * 60 * 1000
          ),

        submittedAt:
          new Date(
            now.getTime() -
              90 * 60 * 1000
          ),

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

        timeTaken: 2400,
      });

      // -----------------------------------
      // Second submitted result
      // -----------------------------------

      await ExamAttempt.create({
        student:
          student._id,

        testSnapshot:
          snapshotTwo._id,

        startedAt:
          new Date(
            now.getTime() -
              60 * 60 * 1000
          ),

        submittedAt:
          new Date(
            now.getTime() -
              10 * 60 * 1000
          ),

        status:
          "SUBMITTED",

        totalQuestions: 10,

        totalMarks: 20,

        correctAnswers: 3,

        wrongAnswers: 5,

        unansweredQuestions: 2,

        obtainedMarks: 6,

        percentage: 30,

        isPassed: false,

        timeTaken: 1800,
      });

      // -----------------------------------
      // In-progress attempt
      // -----------------------------------

      await ExamAttempt.create({
        student:
          student._id,

        testSnapshot:
          snapshotInProgress._id,

        startedAt:
          new Date(
            now.getTime() -
              15 * 60 * 1000
          ),

        status:
          "IN-PROGRESS",

        totalQuestions: 5,

        totalMarks: 15,
      });

      // -----------------------------------
      // Another student's submitted result
      // -----------------------------------

      await ExamAttempt.create({
        student:
          otherStudent._id,

        testSnapshot:
          new mongoose.Types.ObjectId(),

        startedAt:
          new Date(
            now.getTime() -
              2 * 60 * 60 * 1000
          ),

        submittedAt:
          new Date(
            now.getTime() -
              70 * 60 * 1000
          ),

        status:
          "SUBMITTED",

        totalQuestions: 5,

        totalMarks: 10,

        correctAnswers: 5,

        wrongAnswers: 0,

        unansweredQuestions: 0,

        obtainedMarks: 10,

        percentage: 100,

        isPassed: true,

        timeTaken: 1800,
      });
    });

    // =====================================
    // CLEANUP
    // =====================================

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // =====================================
    // 1. RETURN SUBMITTED RESULTS ONLY
    // =====================================

    test(
      "Should return only submitted results for the student",
      async () => {
        const results =
          await studentService.getResultHistory(
            student._id
          );

        expect(
          results
        ).toHaveLength(2);

        expect(
          results.every(
            (result) =>
              result.status ===
                "Pass" ||
              result.status ===
                "Fail"
          )
        ).toBe(true);
      }
    );

    // =====================================
    // 2. LATEST RESULT FIRST
    // =====================================

    test(
      "Should return results sorted by latest submission first",
      async () => {
        const results =
          await studentService.getResultHistory(
            student._id
          );

        expect(
          results
        ).toHaveLength(2);

        expect(
          new Date(
            results[0].submittedAt
          ).getTime()
        ).toBeGreaterThan(
          new Date(
            results[1].submittedAt
          ).getTime()
        );

        expect(
          results[0].examTitle
        ).toBe(
          "Data Structures Test"
        );

        expect(
          results[1].examTitle
        ).toBe(
          "Physics Mock Test"
        );
      }
    );

    // =====================================
    // 3. RETURN STORED RESULT VALUES
    // =====================================

    test(
      "Should return stored marks, percentage and pass/fail status",
      async () => {
        const results =
          await studentService.getResultHistory(
            student._id
          );

        const latest =
          results[0];

        expect(
          latest.totalQuestions
        ).toBe(10);

        expect(
          latest.obtainedMarks
        ).toBe(6);

        expect(
          latest.totalMarks
        ).toBe(20);

        expect(
          latest.percentage
        ).toBe(30);

        expect(
          latest.status
        ).toBe("Fail");

        const previous =
          results[1];

        expect(
          previous.totalQuestions
        ).toBe(5);

        expect(
          previous.obtainedMarks
        ).toBe(8);

        expect(
          previous.totalMarks
        ).toBe(10);

        expect(
          previous.percentage
        ).toBe(80);

        expect(
          previous.status
        ).toBe("Pass");
      }
    );

    // =====================================
    // 4. RETURN EXAM METADATA
    // =====================================

    test(
      "Should return exam title and subject from the test snapshot",
      async () => {
        const results =
          await studentService.getResultHistory(
            student._id
          );

        expect(
          results[0].examTitle
        ).toBe(
          "Data Structures Test"
        );

        expect(
          results[0].subject
        ).toBe(
          "Computer Science"
        );

        expect(
          results[1].examTitle
        ).toBe(
          "Physics Mock Test"
        );

        expect(
          results[1].subject
        ).toBe("Physics");
      }
    );

    // =====================================
    // 5. STUDENT ISOLATION
    // =====================================

    test(
      "Should return only the logged-in student's results",
      async () => {
        const results =
          await studentService.getResultHistory(
            student._id
          );

        expect(
          results
        ).toHaveLength(2);

        expect(
          results.some(
            (result) =>
              result.percentage ===
              100
          )
        ).toBe(false);
      }
    );

    // =====================================
    // 6. NO RESULTS
    // =====================================

    test(
      "Should return an empty array when the student has no submitted results",
      async () => {
        const newStudent =
          await createUser({
            fullName:
              "No Result Student",

            email:
              "noresult@test.com",

            phone:
              "9876543212",

            password:
              "Student@123",

            role:
              "student",
          });

        const results =
          await studentService.getResultHistory(
            newStudent._id
          );

        expect(
          results
        ).toEqual([]);
      }
    );
  }
);