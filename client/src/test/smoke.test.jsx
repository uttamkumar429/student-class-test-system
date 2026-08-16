import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

function SmokeComponent() {
  return (
    <div>
      <h1>Testing Setup Works</h1>
    </div>
  );
}

describe("Frontend Test Setup", () => {
  test("should render a React component", () => {
    render(<SmokeComponent />);

    expect(
      screen.getByRole("heading", {
        name: "Testing Setup Works",
      })
    ).toBeInTheDocument();
  });
});