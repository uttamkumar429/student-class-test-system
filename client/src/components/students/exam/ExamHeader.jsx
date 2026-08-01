import CountdownTimer from "./CountdownTimer";

const ExamHeader = ({
  title,
  subject,
  remainingTime,
  onTimeUp,
  answeredQuestions = 0,
  totalQuestions = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 rounded-xl border border-slate-200 bg-white p-6 shadow-md">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            {title}
          </h1>

          <p className="mt-1 text-slate-500">
            Subject : {subject}
          </p>

        </div>

        {/* Center */}

        <div className="text-center">

          <p className="text-sm text-slate-500">
            Progress
          </p>

          <h2 className="text-xl font-bold text-blue-600">

            {answeredQuestions}/{totalQuestions}

          </h2>

        </div>

        {/* Right */}

        <CountdownTimer
          remainingTime={remainingTime}
          onTimeUp={onTimeUp}
        />

      </div>

    </header>
  );
};

export default ExamHeader;