import { useNavigate } from "react-router-dom";
import UpcomingExamCard from "./UpcomingExamCard";

function UpcomingExams() {
  const navigate = useNavigate();

  // Temporary Static Data
  // Later this will come from API
  const exams = [
    {
      id: 1,
      subject: "Java Programming",
      examDate: "05 Aug 2026",
      duration: "60 Minutes",
      totalMarks: 100,
      difficulty: "Medium",
    },
    {
      id: 2,
      subject: "Database Management System",
      examDate: "08 Aug 2026",
      duration: "45 Minutes",
      totalMarks: 50,
      difficulty: "Easy",
    },
    {
      id: 3,
      subject: "Operating System",
      examDate: "12 Aug 2026",
      duration: "90 Minutes",
      totalMarks: 100,
      difficulty: "Hard",
    },
  ];

  const handleStartExam = (examId) => {
    navigate("/student/exams");

    console.log("Selected Exam :", examId);
  };

  return (
    <section className="mt-10">

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
            key={exam.id}
            subject={exam.subject}
            examDate={exam.examDate}
            duration={exam.duration}
            totalMarks={exam.totalMarks}
            difficulty={exam.difficulty}
            onStart={() => handleStartExam(exam.id)}
          />
        ))}

      </div>

    </section>
  );
}

export default UpcomingExams;