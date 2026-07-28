import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import QuestionSelector from "../../components/tests/QuestionSelector";
import { createTest } from "../../services/testService";
import { useNavigate } from "react-router-dom";
function CreateTest() {
  const [formData, setFormData] = useState({

    title: "",
    subject: "",
    description: "",
    duration: "",
    startTime: "",
    endTime: "",
  });

 const [selectedQuestions, setSelectedQuestions] = useState([]);
 const navigate = useNavigate();
 const [saving, setSaving] = useState(false);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedQuestions.length === 0) {
        alert("Please select at least one question.");
        return;
    }

    try {
        setSaving(true);

        const payload = {
        ...formData,
        duration: Number(formData.duration),
        questions: selectedQuestions,
        };

        await createTest(payload);

        alert("Test created successfully.");

        navigate("/admin/tests");

    } catch (error) {

        alert(
        error.response?.data?.message ||
        "Failed to create test."
        );

    } finally {

        setSaving(false);

    }
    };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border p-8">

        <h1 className="text-3xl font-bold mb-2">
          Create New Test
        </h1>

        <p className="text-slate-500 mb-8">
          Fill all required details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Physics Motion Test"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Physics"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter description..."
            />

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div>

              <label className="block mb-2 font-medium">
                Duration (Minutes)
              </label>

              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Start Time
              </label>

              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                End Time
              </label>

              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

            </div>

          </div>

            <QuestionSelector
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
            />

            <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg"
                >
                {saving ? "Creating..." : "Create Test"}
            </button>

        </form>

      </div>
    </DashboardLayout>
  );
}

export default CreateTest;