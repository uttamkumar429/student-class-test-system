import CountdownTimer from "./CountdownTimer";

const ExamHeader = ({
  title,
  subject,
  remainingTime,
  onTimeUp,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-white p-6 shadow-md md:flex-row md:items-center">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {title}
        </h1>

        <p className="mt-1 text-gray-500">
          Subject: {subject}
        </p>
      </div>

      <CountdownTimer
        remainingTime={remainingTime}
        onTimeUp={onTimeUp}
      />

    </div>
  );
};

export default ExamHeader;