import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "sonner";

import {
  getQuestions,
  deleteQuestion,
} from "../../services/questionService";

import QuestionToolbar from "../../components/questions/QuestionToolbar";
import QuestionTable from "../../components/questions/QuestionTable";
import AddQuestionModal from "../../components/questions/AddQuestionModal";

const Questions = () => {
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const fetchQuestions = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const response = await getQuestions();

    setQuestions(response.data.questions);

  } catch (error) {
    console.error(error);

    setError(
      error.response?.data?.message ||
      "Failed to fetch questions."
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to fetch questions."
    );

  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
  fetchQuestions();
}, [fetchQuestions]);

  const filteredQuestions = useMemo(() => {

  const keyword = search.trim().toLowerCase();

  return questions.filter((question) => {

    return (

      question.question?.toLowerCase().includes(keyword) ||

      question.subject?.toLowerCase().includes(keyword) ||

      question.chapter?.toLowerCase().includes(keyword)

    );

  });

}, [questions, search]);

  const handleEdit = (question) => {

  setSelectedQuestion(question);

  setIsModalOpen(true);

};

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this question?"
  );

  if (!confirmDelete) return;

  try {

    await deleteQuestion(id);

    toast.success("Question deleted successfully.");

    fetchQuestions();

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to delete question."
    );

  }

};
return (

  <DashboardLayout>

    <h1 className="text-3xl font-bold mb-2">
      Question Bank
    </h1>

    <p className="text-slate-500 mb-8">
      Manage all questions here.
    </p>

    <QuestionToolbar
      search={search}
      setSearch={setSearch}
      onAdd={() => {
        setSelectedQuestion(null);
        setIsModalOpen(true);
      }}
    />

    <QuestionTable
      questions={filteredQuestions}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />

    <AddQuestionModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
      }}
      fetchQuestions={fetchQuestions}
      question={selectedQuestion}
    />

  </DashboardLayout>

);
};

export default Questions;