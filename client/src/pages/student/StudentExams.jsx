import { useEffect, useState } from "react";
import { toast } from "sonner";

import ExamCard from "../../components/students/ExamCard";
import { getAvailableExams } from "../../services/studentExamService";
import { useNavigate } from "react-router-dom";
const StudentExams = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

const fetchExams = async () => {
    try {
      setLoading(true);

      const response = await getAvailableExams();

      setExams(response.data.exams || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load exams."
      );
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
    fetchExams();
  }, []);



    const handleStartExam = (exam) => {
        navigate("/student/exam/instructions", {
            state: { exam },
        });
    };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg font-medium text-slate-600">
          Loading Exams...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Available Exams
      </h1>

      {exams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">
            No exams available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

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
};

export default StudentExams;