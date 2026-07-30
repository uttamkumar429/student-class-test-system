import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SubmitModal from "../../components/students/exam/SubmitModal";
import QuestionCard from "../../components/students/exam/QuestionCard";
import QuestionPalette from "../../components/students/exam/QuestionPalette";
import ExamNavigation from "../../components/students/exam/ExamNavigation";
import ExamHeader from "../../components/students/exam/ExamHeader";
import {
  saveAnswer,
  submitExam,
} from "../../redux/studentExam/examThunk";
import {
  saveSelectedAnswer,
  setCurrentQuestion,
  markVisited,
  toggleReviewQuestion,
} from "../../redux/studentExam/examSlice";
function ExamPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSubmitModalOpen, setIsSubmitModalOpen] =
      useState(false);

    const {
      attemptId,
      title,
      subject,
      questions,
      currentQuestionIndex,
      selectedAnswers,
      visitedQuestions,
      reviewQuestions,
      remainingTime,
      loading,
      error,
    } = useSelector((state) => state.studentExam);
    const answeredQuestions = Object.keys(
      selectedAnswers
    ).length;

    const currentQuestion =
      questions?.[currentQuestionIndex];
    const handleOptionSelect = (selectedOption) => {
      if (!currentQuestion) return;

      // 1. Instant UI update
      dispatch(
        saveSelectedAnswer({
          questionId: currentQuestion._id,
          answer: selectedOption,
        })
      );

      // 2. Backend save
      dispatch(
        saveAnswer({
          attemptId,
          payload: {
            questionId: currentQuestion._id,
            selectedAnswer: selectedOption,
            currentQuestionIndex,
          },
        })
      );
    };
    const handlePrevious = () => {

      if (currentQuestionIndex === 0) return;

      dispatch(
        setCurrentQuestion(
          currentQuestionIndex - 1
        )
      );

    };
    useEffect(() => {
        if (!currentQuestion) return;

        dispatch(markVisited(currentQuestion._id));
    }, [currentQuestion, dispatch]);
    const handleNext = () => {
        if (currentQuestionIndex >= questions.length - 1) return;

        dispatch(setCurrentQuestion(currentQuestionIndex + 1));
    };
    const handleQuestionClick = (index) => {
      dispatch(setCurrentQuestion(index));
    };

    const handleToggleReview = () => {
      if (!currentQuestion) return;

      dispatch(toggleReviewQuestion(currentQuestion._id));
    };

    const handleOpenSubmitModal = () => {
      setIsSubmitModalOpen(true);
    };

    const handleCloseSubmitModal = () => {
      setIsSubmitModalOpen(false);
    };

    const handleSubmitExam = async () => {
      try {
        await dispatch(submitExam(attemptId)).unwrap();

        setIsSubmitModalOpen(false);

        navigate(`/student/result/${attemptId}`);
      } catch (error) {
        console.error("Submit failed:", error);
      }
    };


    const handleAutoSubmit = async () => {
      try {
        await dispatch(submitExam(attemptId)).unwrap();

        navigate(`/student/result/${attemptId}`);
      } catch (error) {
        console.error("Auto submit failed:", error);
      }
    };

    
  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Loading Exam...
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

if (!questions.length) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      No Questions Found
    </div>
  );
}

    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <ExamHeader
          title={title}
          subject={subject}
          remainingTime={remainingTime}
          onTimeUp={handleAutoSubmit}
        />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswers[currentQuestion?._id]}
            onOptionSelect={handleOptionSelect}
          />
        </div>

        <div>
          <QuestionPalette
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            visitedQuestions={visitedQuestions}
            selectedAnswers={selectedAnswers}
            reviewQuestions={reviewQuestions}
            onQuestionClick={handleQuestionClick}
          />
        </div>

      </div>
       <div className="mt-6">
          <ExamNavigation
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={
              currentQuestionIndex === questions.length - 1
            }
            isMarkedForReview={
              !!reviewQuestions[currentQuestion?._id]
            }
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToggleReview={handleToggleReview}
            onSubmit={handleOpenSubmitModal}
          />
        </div>
        <SubmitModal
          isOpen={isSubmitModalOpen}
          onClose={handleCloseSubmitModal}
          onConfirm={handleSubmitExam}
          answeredQuestions={answeredQuestions}
          totalQuestions={questions.length}
          loading={loading}
        />
      </div>
    );
}

export default ExamPage;

