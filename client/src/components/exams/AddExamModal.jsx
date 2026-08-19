import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createExam,
  updateExam,
} from "../../services/examService";

const AddExamModal = ({
  isOpen,
  onClose,
  fetchExams,
  exam,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        className: "",
        totalMarks: "",
        duration: "",
        examDate: "",
        status: "Upcoming",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (exam) {
        // Intentional synchronization of edit data into local form state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          title: exam.title || "",
          subject: exam.subject || "",
          className: exam.className || "",
          totalMarks: exam.totalMarks || "",
          duration: exam.duration || "",
          examDate: exam.examDate
            ? exam.examDate.split("T")[0]
            : "",
          status: exam.status || "Upcoming",
        });

        } else {
            setFormData({
                title: "",
                subject: "",
                className: "",
                totalMarks: "",
                duration: "",
                examDate: "",
                status: "Upcoming",
            });
        }
    }, [exam]);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

        try {
          setLoading(true);

          if (exam) {
            await updateExam(exam._id, formData);

            toast.success("Exam updated successfully.");
          } else {
            await createExam(formData);

            toast.success("Exam created successfully.");
          }

          fetchExams();

          handleClose();
        } catch (error) {
            toast.error(
            error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };
    const handleClose = () => {
      setFormData({
        title: "",
        subject: "",
        className: "",
        totalMarks: "",
        duration: "",
        examDate: "",
        status: "Upcoming",
      });

      onClose();
    };
    if (!isOpen) return null;
    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-semibold">
          {exam ? "Edit Exam" : "Add Exam"}
        </h2>

        <button
          onClick={handleClose}
          className="text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Title */}
          <div>
            <label className="mb-1 block font-medium">
              Exam Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1 block font-medium">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-1 block font-medium">
              Class
            </label>

            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Marks */}
          <div>
            <label className="mb-1 block font-medium">
              Total Marks
            </label>

            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1 block font-medium">
              Duration (Minutes)
            </label>

            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block font-medium">
              Exam Date
            </label>

            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="mb-1 block font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : exam
              ? "Update Exam"
              : "Create Exam"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
export default AddExamModal;