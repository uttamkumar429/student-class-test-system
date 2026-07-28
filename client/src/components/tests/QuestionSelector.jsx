import { useEffect, useState } from "react";
import { getQuestions } from "../../services/questionService";

function QuestionSelector({
  selectedQuestions,
  setSelectedQuestions,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const response = await getQuestions({
        limit: 100,
      });

      setQuestions(response.data.questions);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id) => {

    if (selectedQuestions.includes(id)) {

      setSelectedQuestions(
        selectedQuestions.filter(
          (questionId) => questionId !== id
        )
      );

    } else {

      setSelectedQuestions([
        ...selectedQuestions,
        id,
      ]);

    }

  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="space-y-3">

      <h2 className="text-xl font-semibold">
        Select Questions
      </h2>

      <p className="text-slate-500">
        Selected : {selectedQuestions.length}
      </p>

      <div className="border rounded-xl">

        {questions.map((question) => (

          <label
            key={question._id}
            className="flex items-start gap-3 border-b p-4 cursor-pointer hover:bg-slate-50"
          >

            <input
              type="checkbox"
              checked={selectedQuestions.includes(question._id)}
              onChange={() =>
                toggleQuestion(question._id)
              }
            />

            <div>

              <p className="font-medium">
                {question.question}
              </p>

              <div className="flex gap-3 mt-2 text-sm text-slate-500">

                <span>
                  {question.subject}
                </span>

                <span>
                  {question.chapter}
                </span>

                <span>
                  {question.difficulty}
                </span>

                <span>
                  {question.marks} Marks
                </span>

              </div>

            </div>

          </label>

        ))}

      </div>

    </div>
  );
}

export default QuestionSelector;