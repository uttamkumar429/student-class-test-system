const ExamCard = ({ exam, onStart }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      <h3 className="text-xl font-bold text-slate-800">
        {exam.title}
      </h3>

      <p className="mt-2 text-slate-600">
        <span className="font-medium">Subject:</span> {exam.subject}
      </p>

      <p className="mt-1 text-slate-600">
        <span className="font-medium">Questions:</span>{" "}
        {exam.totalQuestions}
      </p>

      <p className="mt-1 text-slate-600">
        <span className="font-medium">Total Marks:</span>{" "}
        {exam.totalMarks}
      </p>

      <p className="mt-1 text-slate-600">
        <span className="font-medium">Duration:</span>{" "}
        {exam.duration} Minutes
      </p>

      <button
        onClick={() => onStart(exam)}
        className="mt-6 w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        Start Exam
      </button>

    </div>
  );
};

export default ExamCard;