import PropTypes from "prop-types";
import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

function ReviewOptionList({
  options = [],
  selectedAnswer,
  correctAnswer,
}) {
  if (!options.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
        No options available.
      </div>
    );
  }

  const getOptionStyle = (optionValue) => {
    const isCorrect = optionValue === correctAnswer;
    const isSelected = optionValue === selectedAnswer;

    // Student selected correct answer
    if (isCorrect && isSelected) {
      return {
        container:
          "border-green-500 bg-green-50",
        badge:
          "bg-green-600 text-white",
        icon: (
          <CheckCircle2
            size={20}
            className="text-green-600"
          />
        ),
        label: "Correct Answer",
      };
    }

    // Correct answer
    if (isCorrect) {
      return {
        container:
          "border-green-500 bg-green-50",
        badge:
          "bg-green-600 text-white",
        icon: (
          <CheckCircle2
            size={20}
            className="text-green-600"
          />
        ),
        label: "Correct Answer",
      };
    }

    // Wrong answer selected by student
    if (isSelected) {
      return {
        container:
          "border-red-500 bg-red-50",
        badge:
          "bg-red-600 text-white",
        icon: (
          <XCircle
            size={20}
            className="text-red-600"
          />
        ),
        label: "Your Answer",
      };
    }

    // Normal option
    return {
      container:
        "border-slate-300 bg-white",
      badge: "",
      icon: null,
      label: "",
    };
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const style = getOptionStyle(option.value);

        return (
          <div
            key={option.value}
            className={`rounded-xl border p-5 transition-all duration-200 ${style.container}`}
          >
            <div className="flex items-start justify-between gap-4">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                  {String.fromCharCode(65 + index)}
                </div>

                <div>

                  <p className="text-base font-medium text-slate-800">
                    {option.text}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                {style.icon}

                {style.label && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    {style.label}
                  </span>
                )}

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

ReviewOptionList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
  selectedAnswer: PropTypes.string,
  correctAnswer: PropTypes.string.isRequired,
};

export default ReviewOptionList;