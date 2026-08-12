import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchReview } from "../../redux/studentReview/reviewThunk";

import {
  selectReview,
  selectLoading,
  selectError,
  
} from "../../redux/studentReview/reviewSelectors";

// Components (Next Phase)
import ReviewHeader from "../../components/students/review/ReviewHeader";
import ReviewPalette from "../../components/students/review/ReviewPalette";
import ReviewQuestionCard from "../../components/students/review/ReviewQuestionCard";
import ReviewNavigation from "../../components/students/review/ReviewNavigation";
import { setCurrentQuestion } from "../../redux/studentReview/reviewSlice";
function ReviewAnswersPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { attemptId } = useParams();

  const review = useSelector(selectReview);

  const loading = useSelector(selectLoading);

  const error = useSelector(selectError);
 

  useEffect(() => {
    if (!attemptId) {
      navigate("/student/results/history", {
        replace: true,
      });

      return;
    }

    const savedIndex = Number(
      localStorage.getItem(
        `reviewQuestionIndex_${attemptId}`
      )
    );

    if (Number.isInteger(savedIndex) && savedIndex >= 0) {
      dispatch(
        setCurrentQuestion(savedIndex)
      );
    }

    dispatch(fetchReview(attemptId));
  }, [
    dispatch,
    attemptId,
    navigate,
  ]);




useEffect(() => {
  if (
    !review ||
    !attemptId
  ) {
    return;
  }

  const savedIndex = Number(
    localStorage.getItem(
      `reviewQuestionIndex_${attemptId}`
    )
  );

  if (
    Number.isInteger(savedIndex) &&
    savedIndex >= 0 &&
    savedIndex < review.questions.length
  ) {
    dispatch(
      setCurrentQuestion(savedIndex)
    );
  }
}, [
  review,
  attemptId,
  dispatch,
]);

  // Loading
  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <h2 className="mt-5 text-xl font-semibold">

            Loading Review...

          </h2>

        </div>

      </div>

    );

  }

  // Error
  if (error) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        <div className="rounded-xl border border-red-200 bg-red-50 p-8">

          <h2 className="text-xl font-bold text-red-600">

            Failed to Load Review

          </h2>

          <p className="mt-3">

            {error}

          </p>

          <button

            onClick={() => dispatch(fetchReview(attemptId))}

            className="mt-5 rounded-lg bg-red-600 px-5 py-2 text-white"

          >

            Retry

          </button>

        </div>

      </div>

    );

  }

  // Empty
  if (!review) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Review Not Found

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl p-6">

        <ReviewHeader review={review} />


        <div className="mt-6 grid gap-6 lg:grid-cols-4">

          <div className="lg:col-span-1">

            <ReviewPalette />

          </div>

          <div className="lg:col-span-3">

            <ReviewQuestionCard />

          </div>

        </div>

        <div className="mt-6">

        <ReviewNavigation
          onBack={() =>
            navigate("/student/results/history")
          }
        />

        </div>

      </div>

    </div>

  );

}

export default ReviewAnswersPage;