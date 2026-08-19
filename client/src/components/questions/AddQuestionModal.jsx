import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  createQuestion,
  updateQuestion,
} from "../../services/questionService";
const initialFormData = {
  subject: "",
  chapter: "",
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",

  correctAnswer: "A",
  difficulty: "Medium",
  marks: 1,
  explanation: "",
};
const AddQuestionModal = ({
  isOpen,
  onClose,
  fetchQuestions,
  question,
}) => {

const [formData, setFormData] =
  useState(initialFormData);

const [loading, setLoading] = useState(false);

useEffect(() => {



  if (question) {
    // Intentional synchronization of question data into local form state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      subject: question.subject || "",
      chapter: question.chapter || "",
      question: question.question || "",
      optionA: question.optionA || "",
      optionB: question.optionB || "",
      optionC: question.optionC || "",
      optionD: question.optionD || "",
      correctAnswer:
        question.correctAnswer || "A",
      difficulty:
        question.difficulty || "Medium",
      marks: question.marks || 1,
      explanation:
        question.explanation || "",
    });

  } else {

    setFormData(initialFormData);

  }

}, [question,isOpen]);

const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

};
const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic Validation
  if (
    !formData.subject.trim() ||
    !formData.chapter.trim() ||
    !formData.question.trim() ||
    !formData.optionA.trim() ||
    !formData.optionB.trim() ||
    !formData.optionC.trim() ||
    !formData.optionD.trim()
  ) {
    toast.error("Please fill all required fields.");
    return;
  }

  try {
    setLoading(true);

    if (question) {
      await updateQuestion(question._id, formData);
      toast.success("Question updated successfully.");
    } else {
      await createQuestion(formData);
      toast.success("Question added successfully.");
    }

    await fetchQuestions();

    setFormData(initialFormData);

    onClose();
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};
if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl">

      {/* Header */}

      <div className="flex items-center justify-between border-b p-5">

        <h2 className="text-xl font-bold">

          {question
            ? "Edit Question"
            : "Add Question"}

        </h2>

        <button
          onClick={onClose}
          className="rounded p-2 hover:bg-slate-100"
        >

          <X size={20} />

        </button>

      </div>

      {/* Body */}

    <div className="p-6">

        <form onSubmit={handleSubmit}>

            {/* Subject & Chapter */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                <label className="mb-2 block text-sm font-medium">
                    Subject
                </label>

                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                </div>

                <div>
                <label className="mb-2 block text-sm font-medium">
                    Chapter
                </label>

                <input
                    type="text"
                    name="chapter"
                    value={formData.chapter}
                    onChange={handleChange}
                    placeholder="Enter chapter"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                </div>

            </div>
            {/* Difficulty & Marks */}

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Difficulty */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

              </div>

              {/* Marks */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Marks
                </label>

                <input
                  type="number"
                  min="1"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />

              </div>

          </div>
            {/* Question */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium">
                Question
              </label>

              <textarea
                rows={4}
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter question..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

          </div>
          {/* Options */}

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Option A */}

            <input
              type="text"
              name="optionA"
              value={formData.optionA}
              onChange={handleChange}
              placeholder="Option A"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {/* Option B */}

            <input
              type="text"
              name="optionB"
              value={formData.optionB}
              onChange={handleChange}
              placeholder="Option B"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {/* Option C */}

            <input
              type="text"
              name="optionC"
              value={formData.optionC}
              onChange={handleChange}
              placeholder="Option C"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {/* Option D */}

            <input
              type="text"
              name="optionD"
              value={formData.optionD}
              onChange={handleChange}
              placeholder="Option D"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

          </div>
          {/* Correct Answer */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium">
              Correct Answer
            </label>

            <select
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>

          </div>
          {/* Explanation */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium">
              Explanation
            </label>

            <textarea
              rows={3}
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="Enter explanation..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

          </div>
          {/* Buttons */}

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2 font-medium transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : question
                ? "Update Question"
                : "Save Question"}
            </button>

          </div>

        </form>

    </div>

    </div>

  </div>
);
};
export default AddQuestionModal;
