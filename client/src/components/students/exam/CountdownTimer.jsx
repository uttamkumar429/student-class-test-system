import {
  useEffect,
  useRef,
} from "react";

import { useDispatch } from "react-redux";

import {
  updateRemainingTime,
} from "../../../redux/studentExam/examSlice";

const CountdownTimer = ({
  remainingTime,
  onTimeUp,
}) => {
  const dispatch = useDispatch();

  const intervalRef = useRef(null);

  const timeRef =
    useRef(remainingTime);

  const onTimeUpRef =
    useRef(onTimeUp);

  const submittedRef =
    useRef(false);

  // ======================================
  // KEEP CURRENT TIME IN SYNC
  // ======================================

  useEffect(() => {
    timeRef.current =
      Math.max(
        Number(remainingTime) || 0,
        0
      );
  }, [remainingTime]);

  // ======================================
  // KEEP CALLBACK IN SYNC
  // ======================================

  useEffect(() => {
    onTimeUpRef.current =
      onTimeUp;
  }, [onTimeUp]);

  // ======================================
  // COUNTDOWN
  // ======================================

  useEffect(() => {
    /*
     * Reset auto-submit guard when a new
     * countdown starts.
     */
    submittedRef.current =
      false;

    /*
     * Clear any previous interval before
     * creating a new one.
     */
    if (intervalRef.current) {
      clearInterval(
        intervalRef.current
      );

      intervalRef.current =
        null;
    }

    /*
     * If no time is available, do not start
     * another interval.
     */
    if (
      timeRef.current <= 0
    ) {
      if (
        !submittedRef.current
      ) {
        submittedRef.current =
          true;

        onTimeUpRef.current?.();
      }

      return;
    }

    intervalRef.current =
      setInterval(() => {
        const currentTime =
          timeRef.current;

        // ------------------------------
        // Time already finished
        // ------------------------------

        if (
          currentTime <= 0
        ) {
          if (
            intervalRef.current
          ) {
            clearInterval(
              intervalRef.current
            );

            intervalRef.current =
              null;
          }

          if (
            !submittedRef.current
          ) {
            submittedRef.current =
              true;

            onTimeUpRef.current?.();
          }

          return;
        }

        // ------------------------------
        // Decrease timer
        // ------------------------------

        const nextTime =
          Math.max(
            currentTime - 1,
            0
          );

        timeRef.current =
          nextTime;

        dispatch(
          updateRemainingTime(
            nextTime
          )
        );

        // ------------------------------
        // Time reached zero
        // ------------------------------

        if (
          nextTime === 0
        ) {
          if (
            intervalRef.current
          ) {
            clearInterval(
              intervalRef.current
            );

            intervalRef.current =
              null;
          }

          if (
            !submittedRef.current
          ) {
            submittedRef.current =
              true;

            onTimeUpRef.current?.();
          }
        }
      }, 1000);

    // ==================================
    // CLEANUP
    // ==================================

    return () => {
      if (
        intervalRef.current
      ) {
        clearInterval(
          intervalRef.current
        );

        intervalRef.current =
          null;
      }
    };
  }, [dispatch]);

  // ======================================
  // FORMAT TIME
  // ======================================

  const safeTime = Math.max(
    Number(remainingTime) || 0,
    0
  );

  const hours = Math.floor(
    safeTime / 3600
  );

  const minutes = Math.floor(
    (safeTime % 3600) / 60
  );

  const seconds =
    safeTime % 60;

  const format = (time) =>
    String(time).padStart(
      2,
      "0"
    );

  // ======================================
  // TIMER COLOR
  // ======================================

  const timerColor =
    safeTime <= 60
      ? "border-red-500 bg-red-100 text-red-700 animate-pulse"
      : safeTime <= 300
      ? "border-orange-400 bg-orange-100 text-orange-700"
      : safeTime <= 600
      ? "border-yellow-400 bg-yellow-100 text-yellow-700"
      : "border-green-400 bg-green-100 text-green-700";

  // ======================================
  // UI
  // ======================================

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining ${format(
        hours
      )}:${format(
        minutes
      )}:${format(seconds)}`}
      className={`rounded-xl border px-5 py-3 shadow ${timerColor}`}
    >
      <p className="text-sm font-medium text-gray-500">
        Time Remaining
      </p>

      <h2 className="mt-1 text-3xl font-bold">
        {format(hours)}:
        {format(minutes)}:
        {format(seconds)}
      </h2>
    </div>
  );
};

export default CountdownTimer;