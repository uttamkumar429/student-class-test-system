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
  useEffect(() => {
    timeRef.current = remainingTime;
}, [remainingTime]);
useEffect(() => {

    intervalRef.current = setInterval(() => {

        if (timeRef.current <= 0) {

            clearInterval(intervalRef.current);

            onTimeUp?.();

            return;
        }

        const nextTime = timeRef.current - 1;

        timeRef.current = nextTime;

        dispatch(updateRemainingTime(nextTime));

    },1000);

    return () => {

        clearInterval(intervalRef.current);

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
    return (

    <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 shadow">

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