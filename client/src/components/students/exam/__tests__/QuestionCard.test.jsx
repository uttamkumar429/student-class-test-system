import {
  describe,
  expect,
  test,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import QuestionCard from "../QuestionCard";

describe("QuestionCard", () => {
  const question = {
    questionId: "q1",

    questionText:
      "What is the capital of France?",

    marks: 2,

    options: [
      {
        value: "A",
        text: "Paris",
      },
      {
        value: "B",
        text: "London",
      },
      {
        value: "C",
        text: "Berlin",
      },
      {
        value: "D",
        text: "Madrid",
      },
    ],
  };

  test("should render the question text", () => {
    render(
      <QuestionCard
        question={question}
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "What is the capital of France?"
      )
    ).toBeInTheDocument();
  });

  test("should render question number and total questions", () => {
    render(
      <QuestionCard
        question={question}
        questionNumber={2}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Question 2 of 5"
      )
    ).toBeInTheDocument();
  });

  test("should render the marks", () => {
    render(
      <QuestionCard
        question={question}
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText("2 Marks")
    ).toBeInTheDocument();
  });

  test("should render all question options", () => {
    render(
      <QuestionCard
        question={question}
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText("Paris")
    ).toBeInTheDocument();

    expect(
      screen.getByText("London")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Berlin")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Madrid")
    ).toBeInTheDocument();
  });

  test("should pass the selected answer to OptionList", () => {
    render(
      <QuestionCard
        question={question}
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer="C"
        onOptionSelect={vi.fn()}
      />
    );

    const optionC =
      screen.getByRole("radio", {
        name: "C Berlin",
      });

    expect(
      optionC
    ).toBeChecked();
  });

  test("should forward option selection to the parent callback", async () => {
    const user =
      userEvent.setup();

    const onOptionSelect =
      vi.fn();

    render(
      <QuestionCard
        question={question}
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={
          onOptionSelect
        }
      />
    );

    const optionA =
      screen.getByRole("radio", {
        name: "A Paris",
      });

    await user.click(
      optionA
    );

    expect(
      onOptionSelect
    ).toHaveBeenCalledTimes(1);

    expect(
      onOptionSelect
    ).toHaveBeenCalledWith(
      "A"
    );
  });

  test("should render the question image when provided", () => {
    const questionWithImage = {
      ...question,
      questionImage:
        "https://example.com/question.png",
    };

    render(
      <QuestionCard
        question={
          questionWithImage
        }
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    const image =
      screen.getByRole("img", {
        name: "Question 1",
      });

    expect(
      image
    ).toHaveAttribute(
      "src",
      "https://example.com/question.png"
    );
  });

  test("should render no-options fallback when options are unavailable", () => {
    const questionWithoutOptions = {
      ...question,
      options: [],
    };

    render(
      <QuestionCard
        question={
          questionWithoutOptions
        }
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "No options available for this question."
      )
    ).toBeInTheDocument();
  });

  test("should render no-question fallback when question is missing", () => {
    render(
      <QuestionCard
        question={null}
        questionNumber={1}
        totalQuestions={5}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "No Question Available"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Unable to load the current question."
      )
    ).toBeInTheDocument();
  });
});