import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import DashboardLayout from "../../layouts/DashboardLayout";

import QuestionHeader from "../../components/questions/QuestionHeader";
import QuestionFilters from "../../components/questions/QuestionFilters";
import QuestionTable from "../../components/questions/QuestionTable";
import QuestionPagination from "../../components/questions/QuestionPagination";
import DeleteQuestionModal from "../../components/questions/DeleteQuestionModal";

import {
  fetchQuestions,
  deleteQuestion,
} from "../../redux/adminQuestion/questionThunk";

import {
  setFilters,
  resetFilters,
  setPage,
} from "../../redux/adminQuestion/questionSlice";

import {
  selectQuestions,
  selectQuestionLoading,
  selectQuestionError,
  selectQuestionPagination,
  selectQuestionFilters,
} from "../../redux/adminQuestion/questionSelectors";

function Questions() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // ===========================
  // Redux State
  // ===========================

  const questions = useSelector(
    selectQuestions
  );

  const loading = useSelector(
    selectQuestionLoading
  );

  const error = useSelector(
    selectQuestionError
  );

  const pagination = useSelector(
    selectQuestionPagination
  );

  const filters = useSelector(
    selectQuestionFilters
  );

  // ===========================
  // Local State
  // ===========================

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] =
    useState(false);

  // ===========================
  // Fetch Questions
  // ===========================

  useEffect(() => {
    dispatch(
      fetchQuestions({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        subject: filters.subject,
        chapter: filters.chapter,
        difficulty: filters.difficulty,
      })
    );
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    filters.search,
    filters.subject,
    filters.chapter,
    filters.difficulty,
  ]);
    // ==========================================
  // Add Question
  // ==========================================

  const handleAddQuestion = () => {
    navigate("/admin/questions/create");
  };

  // ==========================================
  // Preview Question
  // ==========================================

  const handlePreview = (question) => {
    navigate(`/admin/questions/${question._id}`);
  };

  // ==========================================
  // Edit Question
  // ==========================================

  const handleEdit = (question) => {
    navigate(`/admin/questions/edit/${question._id}`);
  };

  // ==========================================
  // Open Delete Modal
  // ==========================================

  const handleDeleteClick = (question) => {
    setSelectedQuestion(question);
    setDeleteModalOpen(true);
  };

  // ==========================================
  // Close Delete Modal
  // ==========================================

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQuestion(null);
  };

  // ==========================================
  // Confirm Delete
  // ==========================================

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;

    try {
      await dispatch(
        deleteQuestion(selectedQuestion._id)
      ).unwrap();

      toast.success(
        "Question deleted successfully."
      );

      handleCloseDeleteModal();

      dispatch(
        fetchQuestions({
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          subject: filters.subject,
          chapter: filters.chapter,
          difficulty: filters.difficulty,
        })
      );

    } catch (error) {
      toast.error(
        error || "Failed to delete question."
      );
    }
  };

    // ==========================
    // Search / Filter
    // ==========================

    const handleFilterChange = (data) => {
      dispatch(setFilters(data));
    };

    // ==========================
    // Reset
    // ==========================

    const handleResetFilters = () => {
      dispatch(resetFilters());
    };

    // ==========================
    // Pagination
    // ==========================

    const handlePageChange = (page) => {
      dispatch(setPage(page));
    };
    return (
      <DashboardLayout>

      <div className="space-y-8">

        {/* ==========================
            Header
        ========================== */}

        <QuestionHeader
          totalQuestions={pagination.total}
          onAddQuestion={handleAddQuestion}
          onImportQuestions={() =>
            toast.info("Import Questions feature is coming soon.")
          }
        />

        {/* ==========================
            Filters
        ========================== */}

        <QuestionFilters
          filters={filters}
          subjects={[
            "Physics",
            "Chemistry",
            "Mathematics",
          ]}
          chapters={[]}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* ==========================
            Questions Table
        ========================== */}

        <QuestionTable
          questions={questions}
          loading={loading}
          error={error}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* ==========================
            Pagination
        ========================== */}

        <QuestionPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          onPageChange={handlePageChange}
        />

        {/* ==========================
            Delete Modal
        ========================== */}

        <DeleteQuestionModal
          isOpen={isDeleteModalOpen}
          question={selectedQuestion}
          loading={loading}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />

      </div>

    </DashboardLayout>
  );
};


export default Questions;
