import { useEffect, useState } from "react";

import QuestionSelector from "../questions/QuestionSelector";
import { toastService } from "../../lib/toast";
function TestForm({
  initialValues,
  onSubmit,
  loading = false,
  submitText = "Save Test",
}) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    duration: "",
    startTime: "",
    endTime: "",
  });

  const [selectedQuestions, setSelectedQuestions] =
    useState([]);

  // ===========================
  // Edit Mode Support
  // ===========================


  useEffect(() => {
    if (!initialValues) return;

    setFormData({
      title: initialValues.title || "",
      subject: initialValues.subject || "",
      description:
        initialValues.description || "",
      duration:
        initialValues.duration || "",
      startTime: initialValues.startTime
        ? initialValues.startTime.slice(0, 16)
        : "",
      endTime: initialValues.endTime
        ? initialValues.endTime.slice(0, 16)
        : "",
    });

    



    setSelectedQuestions(
      initialValues.questions || []
    );
  }, [initialValues]);

  // ===========================
  // Input Change
  // ===========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===========================
  // Submit
  // ===========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedQuestions.length === 0) {
        toastService.error(
        "Please select at least one question."
        );
      return;
    }

    const payload = {
      ...formData,
      duration: Number(formData.duration),
      questions:
      selectedQuestions
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ===========================
          Title
      =========================== */}

      <div>

        <label className="mb-2 block font-medium">

          Title

        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Physics Motion Test"
          className="w-full rounded-lg border px-4 py-3"
        />

      </div>

      {/* ===========================
          Subject
      =========================== */}

      <div>

        <label className="mb-2 block font-medium">

          Subject

        </label>

        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Physics"
          className="w-full rounded-lg border px-4 py-3"
        />

      </div>

      {/* ===========================
          Description
      =========================== */}

      <div>

        <label className="mb-2 block font-medium">

          Description

        </label>

        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description..."
          className="w-full rounded-lg border px-4 py-3"
        />

      </div>

      {/* ===========================
          Duration / Time
      =========================== */}

      <div className="grid gap-5 md:grid-cols-3">

        <div>

          <label className="mb-2 block font-medium">

            Duration (Minutes)

          </label>

          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            Start Time

          </label>

          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">

            End Time

          </label>

          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-3"
          />

        </div>

      </div>
            {/* ===========================
          Questions
      =========================== */}

      <QuestionSelector
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
      />

      {/* ===========================
          Summary
      =========================== */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

        <h3 className="text-lg font-semibold text-slate-800">
          Test Summary
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <p className="text-sm text-slate-500">
              Subject
            </p>

            <p className="mt-1 font-semibold">
              {formData.subject || "--"}
            </p>

          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <p className="text-sm text-slate-500">
              Duration
            </p>

            <p className="mt-1 font-semibold">
              {formData.duration || 0} Minutes
            </p>

          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <p className="text-sm text-slate-500">
              Selected Questions
            </p>

            <p className="mt-1 font-semibold">
              {selectedQuestions.length}
            </p>

          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">

            <p className="text-sm text-slate-500">
              Start Time
            </p>

            <p className="mt-1 font-semibold">
              {formData.startTime || "--"}
            </p>

          </div>

        </div>

      </div>

      {/* ===========================
          Buttons
      =========================== */}

      <div className="flex items-center justify-end gap-4">

        <button
          type="reset"
          onClick={() => {

            setFormData({
              title: "",
              subject: "",
              description: "",
              duration: "",
              startTime: "",
              endTime: "",
            });

            setSelectedQuestions([]);

          }}
          className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : submitText}
        </button>

      </div>

    </form>
  );
}

export default TestForm;