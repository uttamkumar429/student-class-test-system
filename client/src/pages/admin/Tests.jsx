import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getAllTests,
  publishTest,
} from "../../services/testService";
import { useNavigate } from "react-router-dom";
function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      setLoading(true);

      const response = await getAllTests();

      setTests(response.data.tests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    fetchTests();
  }, []);

  const handlePublish = async (id) => {
  try {
    await publishTest(id);

    alert("Test published successfully.");

    fetchTests();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to publish test."
    );

  }
};

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Test Management
            </h1>

            <p className="text-slate-500 mt-1">
              Create, manage and publish tests.
            </p>
          </div>

           <button
              onClick={() => navigate("/admin/tests/create")}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              + Create Test
            </button>
        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search test..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Table */}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-4 py-3 text-left">Title</th>

                <th className="px-4 py-3 text-left">Subject</th>

                <th className="px-4 py-3 text-center">
                  Questions
                </th>

                <th className="px-4 py-3 text-center">
                  Marks
                </th>

                <th className="px-4 py-3 text-center">
                  Duration
                </th>

                <th className="px-4 py-3 text-center">
                  Status
                </th>

                <th className="px-4 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center"
                  >
                    Loading...
                  </td>
                </tr>

              ) : filteredTests.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="py-8 text-center text-slate-500"
                  >
                    No Tests Found
                  </td>

                </tr>

              ) : (

                filteredTests.map((test) => (

                  <tr
                    key={test._id}
                    className="border-t"
                  >
                    <td className="px-4 py-4">
                      {test.title}
                    </td>

                    <td className="px-4 py-4">
                      {test.subject}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {test.totalQuestions}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {test.totalMarks}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {test.duration} min
                    </td>

                    <td className="px-4 py-4 text-center">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          test.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {test.status}
                      </span>

                    </td>

                    <td className="px-4 py-4 text-center">

                      <div className="flex justify-center gap-2">

                        <button
                          className="rounded bg-blue-600 px-3 py-1 text-white"
                        >
                          Edit
                        </button>

                        <button
                          className="rounded bg-red-600 px-3 py-1 text-white"
                        >
                          Delete
                        </button>

                        {test.status === "draft" && (
                        <button
                          onClick={() => handlePublish(test._id)}
                          className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                        >
                          Publish
                        </button>
                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Tests;