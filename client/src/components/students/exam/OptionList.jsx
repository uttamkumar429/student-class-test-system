const OptionList = ({
  options = [],
  selectedAnswer,
  onOptionSelect,
  disabled = false,
}) => {
  if (!options.length) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        No options available.
      </div>
    );
  }

  return (
    <fieldset
      disabled={disabled}
      aria-label="Question Options"
      className="space-y-4"
    >
      <legend className="sr-only">
        Question Options
      </legend>

      {options.map((option, index) => {
        const optionValue =
          option.key ?? option.value;

        const isSelected =
          selectedAnswer === optionValue;

        return (
          <label
            key={optionValue}
            className={`
              flex
              items-start
              gap-4
              rounded-xl
              border
              p-4
              transition-all
              duration-200

              ${
                isSelected
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }

              ${
                disabled
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }
            `}
          >
        <input
          type="radio"
          name="question-option"
          value={optionValue}
          checked={isSelected}
          disabled={disabled}
          onClick={() => {
            onOptionSelect?.(
              isSelected ? null : optionValue
            );
          }}
          readOnly
          className="mt-1 h-4 w-4"
        />

            {/* Option Content */}

            <div className="flex flex-1 gap-3">
              <span
                className={`
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-sm
                  font-semibold

                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }
                `}
              >
                {optionValue}
              </span>

              <div className="flex-1">
                <p className="whitespace-pre-wrap text-slate-700">
                  {option.text}
                </p>

                {/* Optional Option Image */}

                {option.image && (
                  <img
                    src={option.image}
                    alt={`Option ${optionValue}`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                    className="mt-3 max-h-48 rounded-lg border border-slate-200 object-contain"
                  />
                )}
              </div>
            </div>
          </label>
        );
      })}
    </fieldset>
  );
};

export default OptionList;