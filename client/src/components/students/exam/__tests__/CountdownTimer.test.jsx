import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import {
  act,
  render,
  screen,
} from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import CountdownTimer from "../CountdownTimer";

const createTestStore = () =>
  configureStore({
    reducer: {
      studentExam: (
        state = {}
      ) => state,
    },
  });

const renderTimer = (props) => {
  const store =
    createTestStore();

  return {
    store,

    ...render(
      <Provider store={store}>
        <CountdownTimer {...props} />
      </Provider>
    ),
  };
};

describe("CountdownTimer", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("should render the initial remaining time", () => {
    renderTimer({
      remainingTime: 125,
      onTimeUp: vi.fn(),
    });

    expect(
      screen.getByRole("timer")
    ).toHaveAttribute(
      "aria-label",
      "Time remaining 00:02:05"
    );
  });

 test("should dispatch timer updates every second", () => {
  vi.useFakeTimers();

  const onTimeUp =
    vi.fn();

  renderTimer({
    remainingTime: 3,
    onTimeUp,
  });

  vi.advanceTimersByTime(1000);

  expect(
    onTimeUp
  ).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1000);

  expect(
    onTimeUp
  ).not.toHaveBeenCalled();
});

test(
  "should call onTimeUp exactly once when timer reaches zero",
  () => {
    vi.useFakeTimers();

    const onTimeUp =
      vi.fn();

    renderTimer({
      remainingTime: 1,
      onTimeUp,
    });

    vi.advanceTimersByTime(1000);

    expect(
      onTimeUp
    ).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);

    expect(
      onTimeUp
    ).toHaveBeenCalledTimes(1);
  }
);
  test("should immediately call onTimeUp when initial remaining time is zero", () => {
    const onTimeUp =
      vi.fn();

    renderTimer({
      remainingTime: 0,
      onTimeUp,
    });

    expect(
      screen.getByRole("timer")
    ).toHaveAttribute(
      "aria-label",
      "Time remaining 00:00:00"
    );

    expect(
      onTimeUp
    ).toHaveBeenCalledTimes(1);
  });

  test("should never display negative time", () => {
    const onTimeUp =
      vi.fn();

    renderTimer({
      remainingTime: -20,
      onTimeUp,
    });

    expect(
      screen.getByRole("timer")
    ).toHaveAttribute(
      "aria-label",
      "Time remaining 00:00:00"
    );

    expect(
      onTimeUp
    ).toHaveBeenCalledTimes(1);
  });

  test("should clean up the interval on unmount", () => {
    vi.useFakeTimers();

    const onTimeUp =
      vi.fn();

    const {
      unmount,
    } = renderTimer({
      remainingTime: 5,
      onTimeUp,
    });

    unmount();

    vi.advanceTimersByTime(10000);

    expect(
      onTimeUp
    ).not.toHaveBeenCalled();
  });

  test("should use updated remaining time when the prop changes", () => {
    const onTimeUp =
      vi.fn();

    const store =
      createTestStore();

    const { rerender } =
      render(
        <Provider
          store={store}
        >
          <CountdownTimer
            remainingTime={120}
            onTimeUp={onTimeUp}
          />
        </Provider>
      );

    expect(
      screen.getByRole("timer")
    ).toHaveAttribute(
      "aria-label",
      "Time remaining 00:02:00"
    );

    rerender(
      <Provider
        store={store}
      >
        <CountdownTimer
          remainingTime={45}
          onTimeUp={onTimeUp}
        />
      </Provider>
    );

    expect(
      screen.getByRole("timer")
    ).toHaveAttribute(
      "aria-label",
      "Time remaining 00:00:45"
    );
  });
});