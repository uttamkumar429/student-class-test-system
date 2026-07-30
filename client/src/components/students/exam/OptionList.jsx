const OptionList = ({
  options,
  selectedAnswer,
  onOptionSelect,
}) => {
  if (!options?.length) {
    return (
      <p className="text-gray-500">
        No options available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option.value;

        return (
          <label
            key={option.value}
            className={`
              flex
              cursor-pointer
              items-center
              gap-4
              rounded-lg
              border
              p-4
              transition-all
              duration-200

              ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }
            `}
          >
            <input
              type="radio"
              name="question-option"
              value={option.value}
              checked={isSelected}
              onChange={() =>
                onOptionSelect(option.value)
              }
              className="h-4 w-4"
            />

            <span className="font-medium">
              {String.fromCharCode(65 + index)}.
            </span>

            <span>
              {option.text}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default OptionList;