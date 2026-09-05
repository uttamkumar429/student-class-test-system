import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "sonner";

import SubmitModal from "../../components/students/exam/SubmitModal";
import QuestionCard from "../../components/students/exam/QuestionCard";
import QuestionPalette from "../../components/students/exam/QuestionPalette";
import ExamNavigation from "../../components/students/exam/ExamNavigation";
import ExamHeader from "../../components/students/exam/ExamHeader";
import studentExamService from "../../services/studentExamService";
import {
  fetchExamQuestions,
  saveAnswer,
  submitExam,
  updateExamProgress,
} from "../../redux/studentExam/examThunk";

import {
  saveSelectedAnswer,
  clearSelectedAnswer,
  setCurrentQuestion,
  markVisited,
  toggleReviewQuestion,
  resetExam,
} from "../../redux/studentExam/examSlice";
const EMPTY_ANSWERS = {};
function ExamPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

const selectedLanguage =
  location.state?.language || "english";
  // const { attemptId } = useParams();
  const { attemptId: routeAttemptId } =
    useParams();

  const [isSubmitModalOpen, setIsSubmitModalOpen] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const submittingRef = useRef(false);
  const isExamHydratedRef = useRef(false);
  const questionStartTimeRef = useRef(null);
  const questionStoredTimeRef = useRef(0);

  // Serialize exam writes because saveAnswer(),
  // saveCurrentQuestionTime(), and updateExamProgress()
  // all update the same attempt progress.
  const serverWriteQueueRef = useRef(
    Promise.resolve()
  );

  const enqueueServerWrite = useCallback(
    (operation) => {
      const next =
        serverWriteQueueRef.current
          .catch(() => undefined)
          .then(operation);

      serverWriteQueueRef.current =
        next.catch(() => undefined);

      return next;
    },
    []
  );
  const [currentQuestionTime, setCurrentQuestionTime] =
  useState(0);
  const getCurrentQuestionTimeSpent =
    useCallback(() => {
      if (!questionStartTimeRef.current) {
        return 0;
      }

      const timeSpent = Math.floor(
        (Date.now() -
          questionStartTimeRef.current) /
          1000
      );

      return Math.max(timeSpent, 0);
    }, []);
  const {

    
    title,
    subject,
    questions,
    currentQuestionIndex,
    selectedAnswers,
    visitedQuestions,
    reviewQuestions,
    remainingTime,
    loading,
    error,
    
  } = useSelector(
    (state) => state.studentExam
  );

  // ======================================
  // ROUTE ATTEMPT ID
  // ======================================
  //
  // Route ID is the source of truth.
  // Redux attemptId is only used as fallback
  // after exam data has been loaded.
  //
  // ======================================

  const activeAttemptId =
    routeAttemptId;

  // ======================================
  // SAFE QUESTIONS ARRAY
  // ======================================

  const examQuestions = useMemo(
    () =>
      Array.isArray(questions)
        ? questions
        : [],
    [questions]
  );

  // ======================================
  // SAFE ANSWERS MAP
  // ======================================

const answers =
  selectedAnswers &&
  typeof selectedAnswers === "object"
    ? selectedAnswers
    : EMPTY_ANSWERS;

  // ======================================
  // ANSWERED QUESTIONS
  // ======================================

const answeredQuestions =
  Object.values(answers).filter(
    (answer) => answer !== null && answer !== undefined
  ).length;

  // ======================================
  // CURRENT QUESTION
  // ======================================

  const currentQuestion =
    examQuestions[
      currentQuestionIndex
    ] || null;

const currentQuestionForCard =
  currentQuestion
    ? {
        ...currentQuestion,

        questionText:
          selectedLanguage === "hindi" &&
          currentQuestion.questionHindi
            ? currentQuestion.questionHindi
            : currentQuestion.questionText,

        options: [
          {
            value: "A",
            text:
              selectedLanguage === "hindi" &&
              currentQuestion.optionAHindi
                ? currentQuestion.optionAHindi
                : currentQuestion.optionA,
          },
          {
            value: "B",
            text:
              selectedLanguage === "hindi" &&
              currentQuestion.optionBHindi
                ? currentQuestion.optionBHindi
                : currentQuestion.optionB,
          },
          {
            value: "C",
            text:
              selectedLanguage === "hindi" &&
              currentQuestion.optionCHindi
                ? currentQuestion.optionCHindi
                : currentQuestion.optionC,
          },
          {
            value: "D",
            text:
              selectedLanguage === "hindi" &&
              currentQuestion.optionDHindi
                ? currentQuestion.optionDHindi
                : currentQuestion.optionD,
          },
        ],
      }
    : null;
  // ======================================
  // QUESTION ID
  // ======================================
  //
  // IMPORTANT:
  // questionId is the only valid
  // question identifier.
  //
  // ======================================

  const currentQuestionId =
    currentQuestion?.questionId || null;
// ======================================
// QUESTION TIME TRACKING
// ======================================
useEffect(() => {
  if (!currentQuestionId || !activeAttemptId) {
    questionStartTimeRef.current = null;
    questionStoredTimeRef.current = 0;
    
    return undefined;
  }

  const storageKey =
    `testveda:question-time:${activeAttemptId}:${currentQuestionId}`;

  const storedTime = Number(
    window.localStorage.getItem(storageKey)
  );

  const baseTime =
    Number.isFinite(storedTime) && storedTime >= 0
      ? Math.floor(storedTime)
      : 0;

  questionStoredTimeRef.current = baseTime;
  questionStartTimeRef.current = Date.now();

  const updateQuestionTime = () => {
    const elapsed = Math.max(
      0,
      Math.floor(
        (Date.now() -
          questionStartTimeRef.current) /
          1000
      )
    );

    const totalTime =
      questionStoredTimeRef.current +
      elapsed;

    setCurrentQuestionTime(totalTime);

    window.localStorage.setItem(
      storageKey,
      String(totalTime)
    );
  };

  // Show saved time immediately.


  // Update every second.
  const interval = setInterval(
    updateQuestionTime,
    1000
  );

  return () => {
    clearInterval(interval);

    // Save the latest value before leaving the question.
    updateQuestionTime();

    questionStartTimeRef.current = null;
  };
}, [
  currentQuestionId,
  activeAttemptId,
]);
  // ======================================
  // FETCH EXAM QUESTIONS
  // ======================================

  useEffect(() => {
  if (!routeAttemptId) {
    toast.error(
      "Invalid exam attempt."
    );

    navigate(
      "/student/exams",
      {
        replace: true,
      }
    );

    return;
  }

  // --------------------------------------
  // Reset hydration state
  // --------------------------------------

  isExamHydratedRef.current = false;

  // --------------------------------------
  // Clear old exam state
  // --------------------------------------

  dispatch(resetExam());

  // --------------------------------------
  // Load current attempt
  // --------------------------------------

  dispatch(
    fetchExamQuestions(
      routeAttemptId
    )
  )
    .unwrap()
    .then(() => {
      // Server state is now hydrated
      isExamHydratedRef.current = true;
    })
    .catch(() => {
      // Keep hydration disabled
      isExamHydratedRef.current = false;
    });
}, [
  dispatch,
  routeAttemptId,
  navigate,
]);

  // ======================================
  // MARK CURRENT QUESTION AS VISITED
  // ======================================

  useEffect(() => {
    if (!currentQuestionId) {
      return;
    }

    dispatch(
      markVisited(
        currentQuestionId
      )
    );
  }, [
    dispatch,
    currentQuestionId,
  ]);
// ======================================
// PERSIST EXAM PROGRESS
// ======================================

useEffect(() => {
  if (!isExamHydratedRef.current) {
    return;
  }

  if (!activeAttemptId) {
    return;
  }

  if (
    !Number.isInteger(
      currentQuestionIndex
    )
  ) {
    return;
  }

  const progressPayload = {
    attemptId: activeAttemptId,

    currentQuestionIndex,

    visitedQuestions:
      Array.isArray(visitedQuestions)
        ? visitedQuestions
        : Object.keys(visitedQuestions || {}),

    reviewQuestions:
      Array.isArray(reviewQuestions)
        ? reviewQuestions
        : Object.keys(reviewQuestions || {}),
  };

  const timer = setTimeout(() => {
    enqueueServerWrite(() =>
      dispatch(
        updateExamProgress(
          progressPayload
        )
      ).unwrap()
    ).catch((error) => {
      console.error(
        "Progress save failed:",
        error
      );
    });
  }, 300);

  return () => {
    clearTimeout(timer);
  };
}, [
  dispatch,
  enqueueServerWrite,
  activeAttemptId,
  currentQuestionIndex,
  visitedQuestions,
  reviewQuestions,
]);
// ======================================
// HANDLE OPTION SELECT
// ======================================

  const handleOptionSelect = useCallback(
    async (selectedOption) => {

      const timeSpent = Math.max(
        0,
        Math.floor(
          (Date.now() -
            questionStartTimeRef.current) /
            1000
        )
      );

      console.log(
        "SELECTED OPTION RECEIVED:",
        selectedOption,
        typeof selectedOption
      );

    if (!currentQuestionId || !activeAttemptId) {
      return;
    }

    // ----------------------------------
    // Validate answer
    // ----------------------------------

    const validAnswers = ["A", "B", "C", "D"];

    if (
      selectedOption !== null &&
      !validAnswers.includes(selectedOption)
    ) {
      toast.error("Invalid answer selected.");
      return;
    }

    // ----------------------------------
    // Instant UI update
    // ----------------------------------

    if (selectedOption === null) {
      dispatch(
        clearSelectedAnswer({
          questionId: currentQuestionId,
        })
      );
    } else {
      dispatch(
        saveSelectedAnswer({
          questionId: currentQuestionId,
          answer: selectedOption,
        })
      );
    }

    // ----------------------------------
    // Persist answer on server
    // IMPORTANT: null must also reach API
    // ----------------------------------

    try {
      console.log(
        "SAVING ANSWER TO SERVER:",
        selectedOption
      );

await enqueueServerWrite(() =>
  dispatch(
    saveAnswer({
      attemptId: activeAttemptId,

      payload: {
        questionId: currentQuestionId,

        selectedAnswer: selectedOption,

        currentQuestionIndex,

        timeSpent,
      },
    })
  ).unwrap()
);

const totalQuestionTime =
  questionStoredTimeRef.current +
  timeSpent;

questionStoredTimeRef.current =
  totalQuestionTime;

window.localStorage.setItem(
  `testveda:question-time:${activeAttemptId}:${currentQuestionId}`,
  String(totalQuestionTime)
);

setCurrentQuestionTime(
  totalQuestionTime
);

questionStartTimeRef.current =
  Date.now();

console.log(
  "ANSWER SAVED SUCCESSFULLY:",
  selectedOption
);
    } catch (error) {
      console.error(
        "Save answer failed:",
        error
      );

      toast.error(
        error || "Failed to save your answer."
      );

      dispatch(
        fetchExamQuestions(
          activeAttemptId
        )
      );
    }
  },
  [
    dispatch,
    enqueueServerWrite,
    currentQuestionId,
    activeAttemptId,
    currentQuestionIndex,
  ]
);
// ======================================
// SAVE CURRENT QUESTION TIME
// ======================================

const saveCurrentQuestionTime =
  useCallback(async () => {
    const currentQuestion =
      examQuestions[currentQuestionIndex];

    if (!currentQuestion || !activeAttemptId) {
      return;
    }

    const questionId =
      currentQuestion.questionId ||
      currentQuestion._id;

    if (!questionId) {
      return;
    }

    const storageKey =
      `testveda:question-time:${activeAttemptId}:${questionId}`;

    const elapsed = Math.max(
      0,
      getCurrentQuestionTimeSpent()
    );

    const timeSpent =
      questionStoredTimeRef.current +
      elapsed;

    try {
      await enqueueServerWrite(() =>
        studentExamService.saveAnswer(
          activeAttemptId,
          {
            questionId,
            selectedAnswer:
              answers[questionId] ?? null,
            currentQuestionIndex,
            timeSpent,
          }
        )
      );

      questionStoredTimeRef.current =
        timeSpent;

      window.localStorage.setItem(
        storageKey,
        String(timeSpent)
      );

      setCurrentQuestionTime(
        timeSpent
      );

      questionStartTimeRef.current =
        Date.now();
    } catch (error) {
      console.error(
        "Failed to save question time:",
        error
      );
    }
  }, [
    activeAttemptId,
    examQuestions,
    currentQuestionIndex,
    answers,
    getCurrentQuestionTimeSpent,
    enqueueServerWrite,
  ]);

  // ======================================
  // PREVIOUS QUESTION
  // ======================================

const handlePrevious =
  useCallback(async () => {
    if (
      currentQuestionIndex <= 0
    ) {
      return;
    }

    await saveCurrentQuestionTime();

    dispatch(
      setCurrentQuestion(
        currentQuestionIndex - 1
      )
    );
  }, [
    dispatch,
    currentQuestionIndex,
    saveCurrentQuestionTime,
  ]);

  // ======================================
  // NEXT QUESTION
  // ======================================

const handleNext =
  useCallback(async () => {
    if (
      currentQuestionIndex >=
      examQuestions.length - 1
    ) {
      return;
    }

    await saveCurrentQuestionTime();

    dispatch(
      setCurrentQuestion(
        currentQuestionIndex + 1
      )
    );
  }, [
    dispatch,
    currentQuestionIndex,
    examQuestions.length,
    saveCurrentQuestionTime,
  ]);

  // ======================================
  // QUESTION PALETTE
  // ======================================

const handleQuestionClick =
  useCallback(
    async (index) => {
      if (
        index < 0 ||
        index >= examQuestions.length ||
        index === currentQuestionIndex
      ) {
        return;
      }

      await saveCurrentQuestionTime();

      dispatch(
        setCurrentQuestion(index)
      );
    },
    [
      dispatch,
      examQuestions.length,
      currentQuestionIndex,
      saveCurrentQuestionTime,
    ]
  );
  // ======================================
  // TOGGLE REVIEW
  // ======================================

  const handleToggleReview =
    useCallback(() => {
      if (!currentQuestionId) {
        return;
      }


      dispatch(
        toggleReviewQuestion(
          currentQuestionId
        )
      );
    }, [
      dispatch,
      currentQuestionId,
    ]);

  // ======================================
  // OPEN SUBMIT MODAL
  // ======================================

  const handleOpenSubmitModal =
    useCallback(() => {
      if (
        submitting ||
        submittingRef.current
      ) {
        return;
      }

      setIsSubmitModalOpen(true);
    }, [submitting]);

  // ======================================
  // CLOSE SUBMIT MODAL
  // ======================================

  const handleCloseSubmitModal =
    useCallback(() => {
      if (submitting) {
        return;
      }

      setIsSubmitModalOpen(false);
    }, [submitting]);

  // ======================================
  // SUBMIT EXAM
  // ======================================

  const handleSubmitExam =
    useCallback(async () => {
      // ----------------------------------
      // Prevent duplicate submission
      // ----------------------------------

      if (
        !activeAttemptId ||
        submittingRef.current
      ) {
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);

      try {
        await dispatch(
          submitExam(
            activeAttemptId
          )
        ).unwrap();

        // --------------------------------
        // Close modal
        // --------------------------------

        setIsSubmitModalOpen(false);

        // --------------------------------
        // Navigate to result
        // --------------------------------

        navigate(
          `/student/result/${activeAttemptId}`,
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Submit failed:",
          error
        );

        toast.error(
          error ||
            "Failed to submit exam. Please try again."
        );
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }, [
      dispatch,
      activeAttemptId,
      navigate,
    ]);

  // ======================================
  // AUTO SUBMIT
  // ======================================

  const handleAutoSubmit =
    useCallback(async () => {
      // ----------------------------------
      // Prevent duplicate submission
      // ----------------------------------

      if (
        !activeAttemptId ||
        submittingRef.current
      ) {
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);

      try {
        // --------------------------------
        // SAVE CURRENT QUESTION TIME
        // --------------------------------

        await saveCurrentQuestionTime();

        // --------------------------------
        // SUBMIT EXAM
        // --------------------------------

        await dispatch(
          submitExam(
            activeAttemptId
          )
        ).unwrap();

        // --------------------------------
        // Navigate to result
        // --------------------------------

        navigate(
          `/student/result/${activeAttemptId}`,
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Auto submit failed:",
          error
        );

        toast.error(
          error ||
            "Exam could not be submitted automatically."
        );
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }, [
      dispatch,
      activeAttemptId,
      navigate,
      saveCurrentQuestionTime,
    ]);

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div
          className="text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <h2 className="mt-5 text-xl font-semibold text-slate-700">
            Loading Exam...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while your exam is loaded.
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-red-600">
            Unable to Load Exam
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/exams",
                {
                  replace: true,
                }
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Exams
          </button>

        </div>
      </div>
    );
  }

  // ======================================
  // NO QUESTIONS
  // ======================================

  if (!examQuestions.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-slate-700">
            No Questions Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Questions are not available for this exam.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/exams",
                {
                  replace: true,
                }
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Exams
          </button>

        </div>
      </div>
    );
  }

  // ======================================
  // INVALID CURRENT QUESTION
  // ======================================

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-red-600">
            Invalid Question
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            The current question could not be loaded.
          </p>

          <button
            type="button"
            onClick={() =>
              dispatch(
                fetchExamQuestions(
                  activeAttemptId
                )
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reload Exam
          </button>

        </div>
      </div>
    );
  }

  // ======================================
  // EXAM UI
  // ======================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      {/* ====================================
          HEADER
      ==================================== */}

      <ExamHeader
        title={title}
        subject={subject}
        remainingTime={
          remainingTime
        }
        answeredQuestions={
          answeredQuestions
        }
        totalQuestions={
          examQuestions.length
        }
        onTimeUp={
          handleAutoSubmit
        }
      />

      {/* ====================================
          MAIN EXAM AREA
      ==================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">

        {/* ==================================
            QUESTION
        ================================== */}

        <div className="lg:col-span-3">
          <QuestionCard
            question={
              currentQuestionForCard
            }
            questionNumber={
              currentQuestionIndex + 1
            }
            totalQuestions={
              examQuestions.length
            }
            selectedAnswer={
              answers[
                currentQuestionId
              ]
            }
            questionTime={
              currentQuestionTime
            }
            onOptionSelect={
              handleOptionSelect
            }
          />
        </div>

        {/* ==================================
            QUESTION PALETTE
        ================================== */}

        <div>
          <QuestionPalette
            questions={
              examQuestions
            }
            currentQuestionIndex={
              currentQuestionIndex
            }
            visitedQuestions={
              visitedQuestions
            }
            selectedAnswers={
              answers
            }
            reviewQuestions={
              reviewQuestions
            }
            onQuestionClick={
              handleQuestionClick
            }
          />
        </div>

      </div>

      {/* ====================================
          EXAM NAVIGATION
      ==================================== */}

      <div className="mt-6">
        <ExamNavigation
          currentQuestionIndex={
            currentQuestionIndex
          }
          totalQuestions={
            examQuestions.length
          }
          isFirstQuestion={
            currentQuestionIndex === 0
          }
          isLastQuestion={
            currentQuestionIndex ===
            examQuestions.length - 1
          }
          isMarkedForReview={
            Array.isArray(reviewQuestions)
              ? reviewQuestions.some(
                  (id) =>
                    id?.toString() ===
                    currentQuestionId?.toString()
                )
              : Boolean(
                  reviewQuestions?.[
                    currentQuestionId
                  ]
                )
          }
          onPrevious={
            handlePrevious
          }
          onNext={handleNext}
          onToggleReview={
            handleToggleReview
          }
          onSubmit={
            handleOpenSubmitModal
          }
          loading={submitting}
        />
      </div>

      {/* ====================================
          SUBMIT MODAL
      ==================================== */}

      <SubmitModal
        isOpen={
          isSubmitModalOpen
        }
        onClose={
          handleCloseSubmitModal
        }
        onConfirm={
          handleSubmitExam
        }
        answeredQuestions={
          answeredQuestions
        }
        totalQuestions={
          examQuestions.length
        }
        loading={submitting}
      />

    </div>
  );
}

export default ExamPage;