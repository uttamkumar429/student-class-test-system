import { useEffect } from "react";
import { useForm } from "react-hook-form";

function QuestionForm({
  mode = "create",
  initialValues = null,
  loading = false,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      chapter: "",
      difficulty: "Easy",
      marks: 1,
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      explanation: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const submitHandler = (data) => {
    onSubmit(data);
  };
    return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-8"
    >
      {/* ===========================
          Basic Information
      =========================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Question Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Subject */}

          <div>
            <label className="mb-2 block font-medium">
              Subject *
            </label>

            <input
              type="text"
              placeholder="Physics"
              {...register("subject", {
                required: "Subject is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />

            {errors.subject && (
              <p className="mt-1 text-sm text-red-500">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Chapter */}

          <div>
            <label className="mb-2 block font-medium">
              Chapter *
            </label>

            <input
              type="text"
              placeholder="Current Electricity"
              {...register("chapter", {
                required: "Chapter is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            />

            {errors.chapter && (
              <p className="mt-1 text-sm text-red-500">
                {errors.chapter.message}
              </p>
            )}
          </div>

          {/* Difficulty */}

          <div>
            <label className="mb-2 block font-medium">
              Difficulty *
            </label>

            <select
              {...register("difficulty")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>

            </select>
          </div>

          {/* Marks */}

          <div>
            <label className="mb-2 block font-medium">
              Marks *
            </label>

            <input
              type="number"
              min={1}
              {...register("marks", {
                required: "Marks are required",
                min: 1,
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            {errors.marks && (
              <p className="mt-1 text-sm text-red-500">
                {errors.marks.message}
              </p>
            )}
          </div>

        </div>

      </section>

      {/* ===========================
          Question
      =========================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Question
        </h2>

        <textarea
          rows={4}
          placeholder="Enter question..."
          {...register("question", {
            required: "Question is required",
          })}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />

        {errors.question && (
          <p className="mt-1 text-sm text-red-500">
            {errors.question.message}
          </p>
        )}

      </section>

      {/* ===========================
          Options
      =========================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Options
        </h2>

        <div className="grid gap-6">

          {["A", "B", "C", "D"].map((option) => (

            <div key={option}>

              <label className="mb-2 block font-medium">
                Option {option} *
              </label>

              <input
                type="text"
                {...register(`option${option}`, {
                  required: `Option ${option} is required`,
                })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              {errors[`option${option}`] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[`option${option}`].message}
                </p>
              )}

            </div>

          ))}

        </div>

      </section>
            {/* ===========================
          Answer & Explanation
      =========================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Answer & Explanation
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Correct Answer */}

          <div>

            <label className="mb-2 block font-medium">
              Correct Answer *
            </label>

            <select
              {...register("correctAnswer", {
                required: "Correct answer is required",
              })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
            >
              <option value="A">
                Option A
              </option>

              <option value="B">
                Option B
              </option>

              <option value="C">
                Option C
              </option>

              <option value="D">
                Option D
              </option>

            </select>

            {errors.correctAnswer && (
              <p className="mt-1 text-sm text-red-500">
                {errors.correctAnswer.message}
              </p>
            )}

          </div>

        </div>

        {/* Explanation */}

        <div className="mt-6">

          <label className="mb-2 block font-medium">
            Explanation
          </label>

          <textarea
            rows={5}
            placeholder="Explain why the answer is correct..."
            {...register("explanation")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

        </div>

      </section>

      {/* ===========================
          Submit Button
      =========================== */}

      <div className="flex justify-end gap-4">

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create Question"
            : "Update Question"}
        </button>

      </div>

    </form>
  );
}

export default QuestionForm;