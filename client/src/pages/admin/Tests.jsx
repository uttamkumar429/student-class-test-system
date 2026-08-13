import {
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardLayout from "../../layouts/DashboardLayout";

import TestToolbar from "../../components/tests/TestToolbar";
import TestTable from "../../components/tests/TestTable";
import TestSkeleton from "../../components/tests/TestSkeleton";
import TestEmpty from "../../components/tests/TestEmpty";
import Pagination from "../../components/common/Pagination";

import {
  fetchTests,
  deleteTest,
  publishTest,
} from "../../redux/adminTest/testThunk";

import {
  selectTests,
  selectTestLoading,
  selectTestError,
  selectTestFilters,
  selectTestPagination,
} from "../../redux/adminTest/testSelectors";

import {
  setFilters,
  setPage,
} from "../../redux/adminTest/testSlice";

import { toastService } from "../../lib/toast";

function Tests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tests = useSelector(selectTests);

  const loading = useSelector(selectTestLoading);

  const error = useSelector(selectTestError);

  const filters = useSelector(selectTestFilters);

  const pagination = useSelector(
    selectTestPagination
  );
    // ============================
  // Test Fetch Parameters
  // ============================

const getFetchParams = useCallback(
  () => ({
    page: pagination.page,
    limit: pagination.limit,
    search: filters.search,
    subject: filters.subject,
    status: filters.status,
    sort: filters.sort,
  }),
  [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.subject,
    filters.status,
    filters.sort,
  ]
);

  // ============================
  // Fetch Tests
  // ============================

useEffect(() => {
  dispatch(
    fetchTests(
      getFetchParams()
    )
  );
}, [
  dispatch,
  getFetchParams,
]);

  // ============================
  // Search / Filter
  // ============================

  const handleFilterChange = (
    values
  ) => {
    dispatch(setFilters(values));
  };

  // ============================
  // Pagination
  // ============================

  const handlePageChange = (
    page
  ) => {
    dispatch(setPage(page));
  };

  // ============================
  // View
  // ============================

  const handleView = (test) => {
    navigate(
      `/admin/tests/${test._id}`
    );
  };

  // ============================
  // Edit
  // ============================

  const handleEdit = (test) => {
    navigate(
      `/admin/tests/${test._id}/edit`
    );
  };

  // ============================
  // Delete
  // ============================

  const handleDelete = async (
    test
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this test?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(
        deleteTest(test._id)
      ).unwrap();

      toastService.success(
        "Test deleted successfully."
      );

      // --------------------------------
      // Refetch current page so that:
      // - pagination stays consistent
      // - filters remain applied
      // - sorting remains applied
      // --------------------------------

      dispatch(
        fetchTests(
          getFetchParams()
        )
      );
    } catch (error) {
      toastService.error(
        error ||
          "Failed to delete test."
      );
    }
  };

  // ============================
  // Publish
  // ============================

  const handlePublish =
    async (test) => {
      const confirmPublish =
        window.confirm(
          "Publish this test?"
        );

      if (!confirmPublish) {
        return;
      }

      try {
        await dispatch(
          publishTest(test._id)
        ).unwrap();

        toastService.success(
          "Test published successfully."
        );

        // --------------------------------
        // Refresh list from server
        // --------------------------------

        dispatch(
          fetchTests(
            getFetchParams()
          )
        );
      } catch (error) {
        toastService.error(
          error ||
            "Failed to publish test."
        );
      }
    };

  return (
    <DashboardLayout>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <div className="space-y-6">

        <TestToolbar
          filters={filters}
          onFilterChange={
            handleFilterChange
          }
        />

        {loading && (
          <TestSkeleton />
        )}

        {!loading &&
          error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
              {error}
            </div>
          )}

        {!loading &&
          !error &&
          tests.length === 0 && (
            <TestEmpty />
          )}

        {!loading &&
          !error &&
          tests.length >
            0 && (
            <TestTable
              tests={tests}
              onView={
                handleView
              }
              onEdit={
                handleEdit
              }
              onPublish={
                handlePublish
              }
              onDelete={
                handleDelete
              }
            />
          )}

      </div>

    </DashboardLayout>
  );
}

export default Tests;