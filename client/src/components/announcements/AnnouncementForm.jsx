import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Megaphone, Save } from "lucide-react";

const DEFAULT_FORM = {
  title: "",
  description: "",
  type: "info",
  isPublished: false,
  expiresAt: "",
};

function AnnouncementForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Create Announcement",
}) {
  const [formData, setFormData] =
    useState(DEFAULT_FORM);

  const [errors, setErrors] =
    useState({});

  // ======================================
  // EDIT MODE INITIALIZATION
  // ======================================

  useEffect(() => {
    if (!initialValues) {
      setFormData(DEFAULT_FORM);
      return;
    }

    setFormData({
      title: initialValues.title || "",
      description:
        initialValues.description || "",
      type: initialValues.type || "info",
      isPublished:
        Boolean(initialValues.isPublished),
      expiresAt: initialValues.expiresAt
        ? new Date(initialValues.expiresAt)
            .toISOString()
            .slice(0, 16)
        : "",
    });
  }, [initialValues]);

  // ======================================
  // CHANGE HANDLER
  // ======================================

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================
  // VALIDATION
  // ======================================

  const validateForm = () => {
    const nextErrors = {};

    const title =
      formData.title.trim();

    const description =
      formData.description.trim();

    if (!title) {
      nextErrors.title =
        "Announcement title is required.";
    } else if (title.length < 3) {
      nextErrors.title =
        "Title must contain at least 3 characters.";
    } else if (title.length > 200) {
      nextErrors.title =
        "Title cannot exceed 200 characters.";
    }

    if (!description) {
      nextErrors.description =
        "Announcement description is required.";
    } else if (
      description.length > 1000
    ) {
      nextErrors.description =
        "Description cannot exceed 1000 characters.";
    }

    if (
      ![
        "exam",
        "result",
        "warning",
        "info",
      ].includes(formData.type)
    ) {
      nextErrors.type =
        "Please select a valid announcement type.";
    }

    if (formData.expiresAt) {
      const expiryDate =
        new Date(formData.expiresAt);

      if (
        Number.isNaN(
          expiryDate.getTime()
        )
      ) {
        nextErrors.expiresAt =
          "Invalid expiry date.";
      } else if (
        expiryDate <= new Date()
      ) {
        nextErrors.expiresAt =
          "Expiry date must be in the future.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors)
      .length === 0;
  };

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description:
        formData.description.trim(),
      type: formData.type,
      isPublished:
        formData.isPublished,
      expiresAt:
        formData.expiresAt
          ? new Date(
              formData.expiresAt
            ).toISOString()
          : null,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ==================================
          BASIC DETAILS
      ================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Megaphone size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Announcement Details
            </h2>

            <p className="text-sm text-slate-500">
              Provide the message students should see.
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Title */}

          <div>
            <label
              htmlFor="announcement-title"
              className="mb-2 block font-medium text-slate-700"
            >
              Title
            </label>

            <input
              id="announcement-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
              disabled={loading}
              placeholder="Java Programming Exam Published"
              className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                errors.title
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            <div className="mt-1 flex justify-between">
              {errors.title ? (
                <p className="text-sm text-red-600">
                  {errors.title}
                </p>
              ) : (
                <span />
              )}

              <span className="text-xs text-slate-400">
                {formData.title.length}/200
              </span>
            </div>
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="announcement-description"
              className="mb-2 block font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="announcement-description"
              name="description"
              rows={5}
              value={
                formData.description
              }
              onChange={handleChange}
              maxLength={1000}
              disabled={loading}
              placeholder="Enter the announcement details..."
              className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                errors.description
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            <div className="mt-1 flex justify-between">
              {errors.description ? (
                <p className="text-sm text-red-600">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}

              <span className="text-xs text-slate-400">
                {formData.description.length}/1000
              </span>
            </div>
          </div>

          {/* Type + Expiry */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* Type */}

            <div>
              <label
                htmlFor="announcement-type"
                className="mb-2 block font-medium text-slate-700"
              >
                Type
              </label>

              <select
                id="announcement-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                  errors.type
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="info">
                  Information
                </option>

                <option value="exam">
                  Exam
                </option>

                <option value="result">
                  Result
                </option>

                <option value="warning">
                  Warning
                </option>
              </select>

              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Expiry */}

            <div>
              <label
                htmlFor="announcement-expires"
                className="mb-2 block font-medium text-slate-700"
              >
                Expiry Date
                <span className="ml-1 text-sm font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                id="announcement-expires"
                type="datetime-local"
                name="expiresAt"
                value={
                  formData.expiresAt
                }
                onChange={handleChange}
                disabled={loading}
                min={
                  new Date()
                    .toISOString()
                    .slice(0, 16)
                }
                className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 ${
                  errors.expiresAt
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />

              {errors.expiresAt && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expiresAt}
                </p>
              )}
            </div>
          </div>

          {/* Publish Toggle */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                name="isPublished"
                checked={
                  formData.isPublished
                }
                onChange={handleChange}
                disabled={loading}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600"
              />

              <div>
                <p className="font-semibold text-slate-800">
                  Publish immediately
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Published announcements become visible to students immediately.
                </p>
              </div>

            </label>
          </div>

        </div>
      </div>

      {/* ==================================
          ACTIONS
      ================================== */}

      <div className="flex items-center justify-end gap-4">

        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />

          {loading
            ? "Saving..."
            : submitText}
        </button>

      </div>
    </form>
  );
}

AnnouncementForm.propTypes = {
  initialValues:
    PropTypes.shape({
      title: PropTypes.string,
      description:
        PropTypes.string,
      type: PropTypes.string,
      isPublished:
        PropTypes.bool,
      expiresAt:
        PropTypes.string,
    }),

  onSubmit:
    PropTypes.func.isRequired,
  onCancel:
    PropTypes.func.isRequired,

  loading:
    PropTypes.bool,

  submitText:
    PropTypes.string,
};

export default AnnouncementForm;