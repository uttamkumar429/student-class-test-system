import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateRemainingTime } from "../../../redux/studentExam/examSlice";

const CountdownTimer = ({
  remainingTime,
  onTimeUp,
}) => {

  const dispatch = useDispatch();

  const intervalRef = useRef(null);

  const timeRef = useRef(remainingTime);
  const submittedRef = useRef(false);

  useEffect(() => {
    timeRef.current = remainingTime;
}, [remainingTime]);
useEffect(() => {

    intervalRef.current = setInterval(() => {

        if (timeRef.current <= 0) {

            clearInterval(intervalRef.current);

            if (!submittedRef.current) {

                submittedRef.current = true;

                onTimeUp?.();

            }

            return;
        }
        const nextTime = timeRef.current - 1;

        timeRef.current = nextTime;

        dispatch(updateRemainingTime(nextTime));

    },1000);

    return () => {

        if (intervalRef.current) {

            clearInterval(intervalRef.current);

        }

        intervalRef.current = null;

    };

}, [dispatch, onTimeUp]);
const hours = Math.floor(remainingTime / 3600);

const minutes = Math.floor(
    (remainingTime % 3600) / 60
);

const seconds = remainingTime % 60;

const format = (time)=>
String(time).padStart(2,"0");
const timerColor =
        remainingTime <= 60
            ? "border-red-500 bg-red-100 text-red-700 animate-pulse"
            : remainingTime <= 300
            ? "border-orange-400 bg-orange-100 text-orange-700"
            : remainingTime <= 600
            ? "border-yellow-400 bg-yellow-100 text-yellow-700"
            : "border-green-400 bg-green-100 text-green-700";
    return (
        

        <div
          role="timer"
          aria-live="polite"
          className={`rounded-xl border px-5 py-3 shadow ${timerColor}`}
        >

        <p className="text-sm font-medium text-gray-500">

        Time Remaining

        </p>

        <h2 className="mt-1 text-3xl font-bold text-red-600">

        {format(hours)}:
        {format(minutes)}:
        {format(seconds)}

        </h2>

    </div>

    );
};
export default CountdownTimer;