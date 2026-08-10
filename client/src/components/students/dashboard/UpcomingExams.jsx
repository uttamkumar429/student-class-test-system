import { useNavigate } from "react-router-dom";

import UpcomingExamCard from "./UpcomingExamCard";

function UpcomingExams({ exams = [] }) {
  const navigate = useNavigate();

  const handleStartExam = () => {
    navigate("/student/exams");
  };

  if (exams.length === 0) {
    return (
      <section className="mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Upcoming Exams
          </h2>

          <p className="mt-1 text-slate-500">
            Complete your scheduled examinations before the deadline.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-700">
            No upcoming exams
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            There are no upcoming examinations available for you right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Upcoming Exams
          </h2>

          <p className="mt-1 text-slate-500">
            Complete your scheduled examinations before the deadline.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => (
        <UpcomingExamCard
          key={exam._id}
          title={exam.title}
          subject={exam.subject}
          examDate={exam.startTime}
          duration={exam.duration}
          totalMarks={exam.totalMarks}
          onStart={handleStartExam}
        />
        ))}
      </div>
    </section>
  );
}

export default UpcomingExams;