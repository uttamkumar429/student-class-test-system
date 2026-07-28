import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  Award,
} from "lucide-react";

import { startExam } from "../../services/studentExamService";

const ExamInstructions = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const exam = state?.exam;
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
const handleStartExam = async () => {
  try {
    setLoading(true);

    const response = await startExam(exam._id);

    toast.success(response.message);

    console.log(response);

    // Next step:
    // Navigate after attempt is created

  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to start exam."
    );
  } finally {
    setLoading(false);
  }
};
  if (!exam) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-red-600">
            Exam Not Found
          </h2>

          <button
            onClick={() => navigate("/student/exams")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">

      {/* Heading */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Exam Instructions
        </h1>

        <p className="mt-2 text-slate-500">
          Please read all instructions carefully before starting your exam.
        </p>
      </div>

      {/* Exam Details */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">
          Exam Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">
                Subject
              </p>
              <h3 className="font-semibold">
                {exam.subject}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-green-600" />
            <div>
              <p className="text-sm text-slate-500">
                Duration
              </p>
              <h3 className="font-semibold">
                {exam.duration} Minutes
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="text-orange-600" />
            <div>
              <p className="text-sm text-slate-500">
                Total Marks
              </p>
              <h3 className="font-semibold">
                {exam.totalMarks}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-purple-600" />
            <div>
              <p className="text-sm text-slate-500">
                Exam Date
              </p>
              <h3 className="font-semibold">
                {new Date(exam.startTime).toLocaleString()}
              </h3>
            </div>
          </div>

        </div>

      </div>

      {/* Instructions */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <AlertTriangle className="text-amber-500" />

          <h2 className="text-xl font-semibold">
            Important Instructions
          </h2>
        </div>

        <ul className="space-y-3 text-slate-600">

          <li>• Read every question carefully before answering.</li>

          <li>• Timer starts immediately after clicking <b>Start Exam</b>.</li>

          <li>• Do not refresh or close the browser during the exam.</li>

          <li>• All answers are auto-saved during the exam.</li>

          <li>• When the timer ends, the exam will be submitted automatically.</li>

          <li>• Once submitted, you cannot modify your answers.</li>

        </ul>

      </div>

      {/* Agreement */}

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="h-5 w-5"
          />

          <span className="font-medium">
            I have read and understood all the instructions.
          </span>

        </label>

      </div>

      {/* Buttons */}

      <div className="mt-8 flex justify-between">

        <button
          onClick={() => navigate("/student/exams")}
          className="rounded-lg border px-6 py-3 hover:bg-slate-100"
        >
          Back
        </button>

        <button
          disabled={!accepted || loading}
          onClick={handleStartExam}
          
          className={`rounded-lg px-8 py-3 font-medium text-white transition ${
            accepted
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          {loading ? "Starting..." : "Start Exam"}
        </button>

      </div>

    </div>
  );
};

export default ExamInstructions;