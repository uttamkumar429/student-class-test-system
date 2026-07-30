import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchResult } from "../../redux/studentResult/resultThunk";

import ResultSummary from "../../components/students/result/ResultSummary";
import StatisticsCards from "../../components/students/result/StatisticsCards";
import ResultActions from "../../components/students/result/ResultActions";

function ResultPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { attemptId } = useParams();

  const { result, loading, error } = useSelector(
    (state) => state.studentResult
  );

  useEffect(() => {
    dispatch(fetchResult(attemptId));
  }, [dispatch, attemptId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Result...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Result not found.
      </div>
    );
  }

  const {
    examTitle,
    subject,
    obtainedMarks,
    totalMarks,
    percentage,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    timeTaken,
    submittedAt,
    status,
  } = result;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl space-y-8">

        <ResultSummary
          examTitle={examTitle}
          subject={subject}
          obtainedMarks={obtainedMarks}
          totalMarks={totalMarks}
          percentage={percentage}
          status={status}
        />

        <StatisticsCards
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          skippedAnswers={skippedAnswers}
          timeTaken={timeTaken}
          submittedAt={submittedAt}
        />

        <ResultActions
        onBack={() => navigate("/student/dashboard")}
        onReview={() => navigate(`/student/result/${attemptId}/review`)}
        reviewEnabled={false}
        />
      </div>
    </div>
  );
}

export default ResultPage;