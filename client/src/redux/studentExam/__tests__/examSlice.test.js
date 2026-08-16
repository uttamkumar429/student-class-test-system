import { describe, expect, test } from "vitest";

import examReducer, {
  setCurrentQuestion,
  saveSelectedAnswer,
  clearSelectedAnswer,
  markVisited,
  toggleReviewQuestion,
  updateRemainingTime,
  resetExam,
} from "../examSlice";

const createState = (overrides = {}) => ({
  attemptId: "attempt-1",
  testSnapshotId: "snapshot-1",
  title: "Physics Test",
  subject: "Physics",

  questions: [
    {
      questionId: "q1",
      questionText: "Question 1",
      options: [],
      marks: 1,
    },
    {
      questionId: "q2",
      questionText: "Question 2",
      options: [],
      marks: 1,
    },
    {
      questionId: "q3",
      questionText: "Question 3",
      options: [],
      marks: 1,
    },
  ],

  currentQuestionIndex: 0,

  selectedAnswers: {},

  visitedQuestions: {},

  reviewQuestions: {},

  remainingTime: 120,

  submitted: false,

  availableExams: [],

  activeExams: [],

  completedExams: [],

  loading: false,

  error: null,

  progressSaving: false,

  progressError: null,

  ...overrides,
});

describe("studentExam reducer", () => {
  test("should move to a valid question index", () => {
    const state =
      createState();

    const nextState =
      examReducer(
        state,
        setCurrentQuestion(2)
      );

    expect(
      nextState.currentQuestionIndex
    ).toBe(2);
  });

  test("should ignore an invalid question index", () => {
    const state =
      createState();

    const nextState =
      examReducer(
        state,
        setCurrentQuestion(99)
      );

    expect(
      nextState.currentQuestionIndex
    ).toBe(0);
  });

  test("should save a valid selected answer", () => {
    const state =
      createState();

    const nextState =
      examReducer(
        state,
        saveSelectedAnswer({
          questionId: "q1",
          answer: "B",
        })
      );

    expect(
      nextState.selectedAnswers.q1
    ).toBe("B");
  });

  test("should clear an answer when null is selected", () => {
    const state =
      createState({
        selectedAnswers: {
          q1: "B",
        },
      });

    const nextState =
      examReducer(
        state,
        clearSelectedAnswer({
          questionId: "q1",
        })
      );

    expect(
      nextState.selectedAnswers.q1
    ).toBeUndefined();
  });

  test("should ignore an invalid selected answer", () => {
    const state =
      createState();

    const nextState =
      examReducer(
        state,
        saveSelectedAnswer({
          questionId: "q1",
          answer: "X",
        })
      );

    expect(
      nextState.selectedAnswers
    ).toEqual({});
  });

  test("should mark a question as visited", () => {
    const state =
      createState();

    const nextState =
      examReducer(
        state,
        markVisited("q2")
      );

    expect(
      nextState.visitedQuestions.q2
    ).toBe(true);
  });

  test("should toggle a question for review", () => {
    let state =
      createState();

    state =
      examReducer(
        state,
        toggleReviewQuestion("q2")
      );

    expect(
      state.reviewQuestions.q2
    ).toBe(true);

    state =
      examReducer(
        state,
        toggleReviewQuestion("q2")
      );

    expect(
      state.reviewQuestions.q2
    ).toBeUndefined();
  });

  test("should never allow remaining time below zero", () => {
    const state =
      createState({
        remainingTime: 10,
      });

    const nextState =
      examReducer(
        state,
        updateRemainingTime(-50)
      );

    expect(
      nextState.remainingTime
    ).toBe(0);
  });

  test("should reset the exam state", () => {
    const state =
      createState({
        currentQuestionIndex: 2,

        selectedAnswers: {
          q1: "A",
        },

        visitedQuestions: {
          q1: true,
        },

        reviewQuestions: {
          q2: true,
        },

        remainingTime: 45,

        submitted: true,
      });

    const nextState =
      examReducer(
        state,
        resetExam()
      );

    expect(
      nextState.currentQuestionIndex
    ).toBe(0);

    expect(
      nextState.selectedAnswers
    ).toEqual({});

    expect(
      nextState.visitedQuestions
    ).toEqual({});

    expect(
      nextState.reviewQuestions
    ).toEqual({});

    expect(
      nextState.submitted
    ).toBe(false);

    expect(
      nextState.remainingTime
    ).toBe(0);
  });
});