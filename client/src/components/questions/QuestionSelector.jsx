import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import QuestionSelectorToolbar from "./QuestionSelectorToolbar";
import QuestionSelectorTable from "./QuestionSelectorTable";
import QuestionSelectorSkeleton from "./QuestionSelectorSkeleton";

import { fetchQuestions } from "../../redux/adminQuestion/questionThunk";

import {
  selectQuestions,
  selectQuestionLoading,
  selectQuestionError,
} from "../../redux/adminQuestion/questionSelectors";

function QuestionSelector({
  selectedQuestions,
  setSelectedQuestions,
}) {
  const dispatch = useDispatch();

  const questions = useSelector(selectQuestions);
  const loading = useSelector(selectQuestionLoading);
  const error = useSelector(selectQuestionError);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // =========================
  // Load Questions
  // =========================

  useEffect(() => {
    dispatch(
      fetchQuestions({
        page: 1,
        limit: 1000,
        search,
        subject,
        difficulty,
      })
    );
  }, [
    dispatch,
    search,
    subject,
    difficulty,
  ]);

  // =========================
  // Subjects
  // =========================

  const subjects = useMemo(() => {
    return [...new Set(
      questions.map((question) => question.subject)
    )];
  }, [questions]);

  // =========================
  // Toggle Question
  // =========================

  const toggleQuestion = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(
        selectedQuestions.filter(
          (questionId) => questionId !== id
        )
      );
    } else {
      setSelectedQuestions([
        ...selectedQuestions,
        id,
      ]);
    }
  };

  // =========================
  // Select All
  // =========================

  const handleSelectAll = () => {
    setSelectedQuestions(
      questions.map((question) => question._id)
    );
  };

  // =========================
  // Clear
  // =========================

  const handleClearSelection = () => {
    setSelectedQuestions([]);
  };

  // =========================
  // Total Marks
  // =========================

  const totalMarks = useMemo(() => {
    return questions
      .filter((question) =>
        selectedQuestions.includes(question._id)
      )
      .reduce(
        (total, question) =>
          total + question.marks,
        0
      );
  }, [
    questions,
    selectedQuestions,
  ]);

  if (loading) {
    return <QuestionSelectorSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Toolbar */}

      <QuestionSelectorToolbar
        search={search}
        onSearchChange={setSearch}
        subject={subject}
        onSubjectChange={setSubject}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        subjects={subjects}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      {/* Summary */}

      <div className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <p className="font-medium text-slate-700">
          Selected Questions :
          <span className="ml-2 font-bold text-blue-600">
            {selectedQuestions.length}
          </span>
        </p>

        <p className="font-medium text-slate-700">
          Total Marks :
          <span className="ml-2 font-bold text-green-600">
            {totalMarks}
          </span>
        </p>

      </div>

      {/* Table */}

      <QuestionSelectorTable
        questions={questions}
        selectedQuestions={selectedQuestions}
        onToggleQuestion={toggleQuestion}
      />

    </div>
  );
}

export default QuestionSelector;