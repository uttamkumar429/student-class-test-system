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

import OptionList from "../OptionList";

describe("OptionList", () => {
  const options = [
    {
      key: "A",
      text: "Option A",
    },
    {
      key: "B",
      text: "Option B",
    },
    {
      key: "C",
      text: "Option C",
    },
    {
      key: "D",
      text: "Option D",
    },
  ];

  test("should render all available options", () => {
    render(
      <OptionList
        options={options}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText("Option A")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Option B")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Option C")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Option D")
    ).toBeInTheDocument();
  });

  test("should mark the selected option as checked", () => {
    render(
      <OptionList
        options={options}
        selectedAnswer="B"
        onOptionSelect={vi.fn()}
      />
    );

    const radioButtons =
      screen.getAllByRole("radio");

    expect(
      radioButtons
        .find(
          (radio) =>
            radio.value === "B"
        )
    ).toBeChecked();

    expect(
      radioButtons
        .find(
          (radio) =>
            radio.value === "A"
        )
    ).not.toBeChecked();
  });


  test("should select option A when its radio button is clicked", async () => {
    const user =
      userEvent.setup();

    const onOptionSelect =
      vi.fn();

    render(
      <OptionList
        options={options}
        selectedAnswer={null}
        onOptionSelect={
          onOptionSelect
        }
      />
    );

    const radioButtons =
      screen.getAllByRole("radio");

    const optionA =
      radioButtons.find(
        (radio) =>
          radio.value === "A"
      );

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

  test("should clear the selected option when the same option is clicked again", async () => {
    const user =
      userEvent.setup();

    const onOptionSelect =
      vi.fn();

    render(
      <OptionList
        options={options}
        selectedAnswer="B"
        onOptionSelect={
          onOptionSelect
        }
      />
    );

    const radioButtons =
      screen.getAllByRole("radio");

    const optionB =
      radioButtons.find(
        (radio) =>
          radio.value === "B"
      );

    await user.click(
      optionB
    );

    expect(
      onOptionSelect
    ).toHaveBeenCalledTimes(1);

    expect(
      onOptionSelect
    ).toHaveBeenCalledWith(
      null
    );
  });

  test("should not allow selection when disabled", async () => {
    const user =
      userEvent.setup();

    const onOptionSelect =
      vi.fn();

    render(
      <OptionList
        options={options}
        selectedAnswer={null}
        onOptionSelect={
          onOptionSelect
        }
        disabled={true}
      />
    );

    const radioButtons =
      screen.getAllByRole("radio");

    for (const radio of radioButtons) {
      expect(
        radio
      ).toBeDisabled();
    }

    await user.click(
      radioButtons[0]
    );

    expect(
      onOptionSelect
    ).not.toHaveBeenCalled();
  });

  test("should render empty state when no options are provided", () => {
    render(
      <OptionList
        options={[]}
        selectedAnswer={null}
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "No options available."
      )
    ).toBeInTheDocument();
  });

  test("should support option values coming from value instead of key", () => {
    const valueOptions = [
      {
        value: "A",
        text: "Value Option A",
      },
      {
        value: "B",
        text: "Value Option B",
      },
    ];

    render(
      <OptionList
        options={valueOptions}
        selectedAnswer="B"
        onOptionSelect={vi.fn()}
      />
    );

    expect(
      screen.getByDisplayValue("B")
    ).toBeChecked();

    expect(
      screen.getByText(
        "Value Option B"
      )
    ).toBeInTheDocument();
  });
});