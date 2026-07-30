import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchResultHistory } from "../../redux/studentResult/resultThunk";

import ResultHistoryTable from "../../components/students/result/ResultHistoryTable";
import EmptyHistory from "../../components/students/result/EmptyHistory";

function ResultHistory() {
  const dispatch = useDispatch();

  const {
    resultHistory,
    loading,
    error,
  } = useSelector((state) => state.studentResult);

  useEffect(() => {
    dispatch(fetchResultHistory());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Result History...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Result History
        </h1>

        {resultHistory.length === 0 ? (
          <EmptyHistory />
        ) : (
          <ResultHistoryTable
            results={resultHistory}
          />
        )}

      </div>
    </div>
  );
}

export default ResultHistory;