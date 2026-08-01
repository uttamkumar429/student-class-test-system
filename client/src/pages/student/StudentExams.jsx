import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ExamCard from "../../components/students/ExamCard";

import { fetchAvailableExams } from "../../redux/studentExam/examThunk";
import {
  selectAvailableExams,
  selectExamLoading,
  selectExamError,
} from "../../redux/studentExam/examSelectors";

function StudentExams() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const exams = useSelector(selectAvailableExams);
  const loading = useSelector(selectExamLoading);
  const error = useSelector(selectExamError);

  useEffect(() => {
    dispatch(fetchAvailableExams());
  }, [dispatch]);

  const handleStartExam = (exam) => {
    navigate("/student/exam/instructions", {
      state: { exam },
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <h2 className="text-xl font-semibold text-slate-700">
            Loading Exams...
          </h2>

          <p className="mt-2 text-slate-500">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

        <h2 className="text-xl font-bold text-red-600">
          Failed to Load Exams
        </h2>

        <p className="mt-2 text-red-500">
          {error}
        </p>

        <button
          onClick={() => dispatch(fetchAvailableExams())}
          className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Available Exams
        </h1>

        <p className="mt-2 text-slate-500">
          Start your scheduled examinations.
        </p>

      </div>

      {/* Empty */}

      {exams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">

          <h2 className="text-2xl font-semibold text-slate-700">
            No Exams Available
          </h2>

          <p className="mt-3 text-slate-500">
            Your upcoming examinations will appear here.
          </p>

        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {exams.map((exam) => (
            <ExamCard
              key={exam._id}
              exam={exam}
              onStart={handleStartExam}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default StudentExams;