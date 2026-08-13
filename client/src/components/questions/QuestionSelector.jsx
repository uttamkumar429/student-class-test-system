import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch } from "react-redux";

import QuestionSelectorToolbar from "./QuestionSelectorToolbar";
import QuestionSelectorTable from "./QuestionSelectorTable";
import QuestionSelectorSkeleton from "./QuestionSelectorSkeleton";

import { fetchQuestions } from "../../redux/adminQuestion/questionThunk";

function QuestionSelector({
  selectedQuestions,
  setSelectedQuestions,
  selectedQuestionDetails = [],
}) {
  const dispatch = useDispatch();

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] =
    useState("");

  // ==========================================
  // QUESTION LIST STATE
  // ==========================================

  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [page, setPage] =
    useState(1);

  const [totalQuestions, setTotalQuestions] =
    useState(0);

  const [hasMore, setHasMore] =
    useState(false);

  // ==========================================
  // SELECTED QUESTION DETAILS
  // ==========================================
  //
  // Stores complete question objects by ID.
  //
  // This is important because selectedQuestions
  // contains only IDs, while total marks requires
  // question marks.
  //
  // ==========================================

const [
  selectedQuestionMap,
  setSelectedQuestionMap,
] = useState(() => {
  if (
    !Array.isArray(
      selectedQuestionDetails
    )
  ) {
    return {};
  }

  const map = {};

  for (
    const question of
      selectedQuestionDetails
  ) {
    if (
      question &&
      typeof question === "object" &&
      question._id
    ) {
      map[question._id] =
        question;
    }
  }

  return map;
});

  // ==========================================
  // FETCH FIRST PAGE
  // ==========================================

  useEffect(() => {
    let isActive = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setPage(1);

        const response = await dispatch(
          fetchQuestions({
            page: 1,

            // Backend production limit.
            limit: 100,

            search,
            subject,
            difficulty,

            // Stable default ordering.
            sortBy: "createdAt",
            order: "desc",
          })
        ).unwrap();

        if (!isActive) {
          return;
        }

        const data = response.data || {};

        const fetchedQuestions =
          Array.isArray(data.questions)
            ? data.questions
            : [];

        const currentPage =
          Number(data.page) || 1;

        const total =
          Number(data.total) || 0;

        const totalPages =
          Number(data.totalPages) || 1;

        setQuestions(
          fetchedQuestions
        );

        setPage(currentPage);

        setTotalQuestions(total);

        setHasMore(
          currentPage < totalPages
        );

        // ------------------------------------
        // Preserve question details for
        // currently selected questions.
        // ------------------------------------

      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setError(
          requestError ||
            "Failed to load questions."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isActive = false;
    };
  }, [
    dispatch,
    search,
    subject,
    difficulty,
  ]);

  // ==========================================
  // LOAD NEXT PAGE
  // ==========================================

  const handleLoadMore = async () => {
    if (
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    const nextPage = page + 1;

    try {
      setLoadingMore(true);
      setError(null);

      const response = await dispatch(
        fetchQuestions({
          page: nextPage,

          // Backend maximum.
          limit: 100,

          search,
          subject,
          difficulty,

          sortBy: "createdAt",
          order: "desc",
        })
      ).unwrap();

      const data =
        response.data || {};

      const nextQuestions =
        Array.isArray(data.questions)
          ? data.questions
          : [];

      const currentPage =
        Number(data.page) ||
        nextPage;

      const total =
        Number(data.total) || 0;

      const totalPages =
        Number(data.totalPages) || 1;

      // ------------------------------------
      // Append without duplicates
      // ------------------------------------

      setQuestions(
        (previousQuestions) => {
          const existingIds =
            new Set(
              previousQuestions.map(
                (question) =>
                  question._id
              )
            );

          const newQuestions =
            nextQuestions.filter(
              (question) =>
                !existingIds.has(
                  question._id
                )
            );

          return [
            ...previousQuestions,
            ...newQuestions,
          ];
        }
      );

      setPage(currentPage);

      setTotalQuestions(total);

      setHasMore(
        currentPage < totalPages
      );

      // ------------------------------------
      // Store selected question details
      // ------------------------------------

      setSelectedQuestionMap(
        (previous) => {
          const next = {
            ...previous,
          };

          for (
            const question of
              nextQuestions
          ) {
            if (
              selectedQuestions.includes(
                question._id
              )
            ) {
              next[question._id] =
                question;
            }
          }

          return next;
        }
      );
    } catch (requestError) {
      setError(
        requestError ||
          "Failed to load more questions."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // ==========================================
  // TOGGLE QUESTION
  // ==========================================

const toggleQuestion = (
  questionOrId
) => {
  const questionId =
    typeof questionOrId === "string"
      ? questionOrId
      : questionOrId?._id;

  if (!questionId) {
    return;
  }

  const question =
    typeof questionOrId === "object"
      ? questionOrId
      : questions.find(
          (item) =>
            item._id === questionId
        );

  const isSelected =
    selectedQuestions.includes(
      questionId
    );

  // ========================================
  // UNSELECT
  // ========================================

  if (isSelected) {
    setSelectedQuestions(
      selectedQuestions.filter(
        (selectedId) =>
          selectedId !== questionId
      )
    );

    setSelectedQuestionMap(
      (previous) => {
        const next = {
          ...previous,
        };

        delete next[questionId];

        return next;
      }
    );

    return;
  }

  // ========================================
  // SELECT
  // ========================================

  setSelectedQuestions(
    (previous) => [
      ...previous,
      questionId,
    ]
  );

  if (question) {
    setSelectedQuestionMap(
      (previous) => ({
        ...previous,
        [questionId]:
          question,
      })
    );
  }
};

  // ==========================================
  // SELECT ALL CURRENT PAGE
  // ==========================================

  const handleSelectAll = () => {
    if (!questions.length) {
      return;
    }

    const currentPageIds =
      questions.map(
        (question) =>
          question._id
      );

    const mergedIds = [
      ...selectedQuestions,
      ...currentPageIds,
    ];

    // Remove duplicates while
    // preserving insertion order.
    const uniqueIds = [
      ...new Set(mergedIds),
    ];

    setSelectedQuestions(
      uniqueIds
    );

    setSelectedQuestionMap(
      (previous) => {
        const next = {
          ...previous,
        };

        for (
          const question of questions
        ) {
          next[question._id] =
            question;
        }

        return next;
      }
    );
  };

  // ==========================================
  // CLEAR ALL SELECTION
  // ==========================================

  const handleClearSelection = () => {
    setSelectedQuestions([]);

    setSelectedQuestionMap({});
  };

  // ==========================================
  // TOTAL MARKS
  // ==========================================

  const totalMarks = useMemo(() => {
    return selectedQuestions.reduce(
      (
        total,
        questionId
      ) => {
        const question =
          selectedQuestionMap[
            questionId
          ];

        if (!question) {
          return total;
        }

        const marks =
          Number(
            question.marks
          );

        return (
          total +
          (
            Number.isFinite(
              marks
            )
              ? marks
              : 0
          )
        );
      },
      0
    );
  }, [
    selectedQuestions,
    selectedQuestionMap,
  ]);

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (loading) {
    return (
      <QuestionSelectorSkeleton />
    );
  }

  // ==========================================
  // INITIAL LOAD ERROR
  // ==========================================

  if (
    error &&
    questions.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ==================================
          Toolbar
      ================================== */}

      <QuestionSelectorToolbar
        search={search}
        onSearchChange={setSearch}
        subject={subject}
        onSubjectChange={setSubject}
        difficulty={difficulty}
        onDifficultyChange={
          setDifficulty
        }
        subjects={[
          ...new Set(
            questions.map(
              (question) =>
                question.subject
            )
          ),
        ]}
        onSelectAll={
          handleSelectAll
        }
        onClearSelection={
          handleClearSelection
        }
      />

      {/* ==================================
          Summary
      ================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div>
          <p className="font-medium text-slate-700">
            Selected Questions:
            <span className="ml-2 font-bold text-blue-600">
              {selectedQuestions.length}
            </span>
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold">
              {questions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {totalQuestions}
            </span>{" "}
            matching questions.
          </p>
        </div>

        <p className="font-medium text-slate-700">
          Total Marks:
          <span className="ml-2 font-bold text-green-600">
            {totalMarks}
          </span>
        </p>

      </div>

      {/* ==================================
          Error while loading more
      ================================== */}

      {error &&
        questions.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

      {/* ==================================
          Question Table
      ================================== */}

      <QuestionSelectorTable
        questions={questions}
        selectedQuestions={
          selectedQuestions
        }
        onToggleQuestion={
          toggleQuestion
        }
      />

      {/* ==================================
          Load More
      ================================== */}

      {questions.length > 0 &&
        hasMore && (
          <div className="flex flex-col items-center gap-3">

            <button
              type="button"
              onClick={
                handleLoadMore
              }
              disabled={loadingMore}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loadingMore
                ? "Loading Questions..."
                : "Load More Questions"}
            </button>

            <p className="text-xs text-slate-500">
              {questions.length} of{" "}
              {totalQuestions} loaded
            </p>

          </div>
        )}

      {!hasMore &&
        questions.length > 0 && (
          <p className="text-center text-xs text-slate-500">
            All matching questions
            have been loaded.
          </p>
        )}

    </div>
  );
}

export default QuestionSelector;