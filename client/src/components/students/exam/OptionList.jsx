const OptionList = ({
  options = [],
  selectedAnswer,
  onOptionSelect,
  disabled = false,
}) => {
  if (!options.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
        <p className="text-slate-500">
          No options available.
        </p>
      </div>
    );
  }

  return (
    <fieldset className="space-y-4">

      <legend className="sr-only">
        Question Options
      </legend>

      {options.map((option, index) => {

        const isSelected =
          selectedAnswer === option.value;

        return (

          <label
            key={option.value}
            className={`
              flex
              cursor-pointer
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
                  : ""
              }
            `}
          >

            <input
              type="radio"
              name="question-option"
              value={option.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() =>
                onOptionSelect(option.value)
              }
              className="mt-1 h-4 w-4"
            />

            {/* Option Label */}

            <div className="flex flex-1 gap-3">

              <span
                className={`
                  flex
                  h-7
                  w-7
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
                {String.fromCharCode(65 + index)}
              </span>

              <div className="flex-1">

                <p className="whitespace-pre-wrap text-slate-700">
                  {option.text}
                </p>

                {/* Future Image Support */}

                {option.image && (
                  <img
                    src={option.image}
                    alt={`Option ${index + 1}`}
                    loading="lazy"
                    className="mt-3 max-h-48 rounded-lg border border-slate-200"
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