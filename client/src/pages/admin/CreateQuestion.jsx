import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";
import QuestionForm from "../../components/questions/QuestionForm";

import {
  createQuestion,
} from "../../redux/adminQuestion/questionThunk";

import {
  clearError,
  clearSuccess,
} from "../../redux/adminQuestion/questionSlice";

import {
  selectQuestionLoading,
  selectQuestionError,
} from "../../redux/adminQuestion/questionSelectors";

function CreateQuestion() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(
    selectQuestionLoading
  );

  const error = useSelector(
    selectQuestionError
  );

  const handleSubmit = async (data) => {

    try {

      await dispatch(
        createQuestion(data)
      ).unwrap();

      toast.success(
        "Question created successfully."
      );

      dispatch(clearSuccess());

      navigate("/admin/questions");

    } catch (error) {

      toast.error(
        error || "Failed to create question."
      );

    }

  };

  useEffect(() => {

    if (!error) return;

    toast.error(error);

    dispatch(clearError());

  }, [
    error,
    dispatch,
  ]);

  return (

    <DashboardLayout>

      <div className="mx-auto max-w-5xl space-y-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Create Question
          </h1>

          <p className="mt-2 text-slate-500">
            Add a new question to the question bank.
          </p>

        </div>

        <QuestionForm
          mode="create"
          loading={loading}
          onSubmit={handleSubmit}
        />

      </div>

    </DashboardLayout>

  );

}

export default CreateQuestion;