import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("should render app correctly", () => {
    const { container } = render(<App />);

    // Should render both stopwatches
    const stopWatchDescriptions = container.querySelectorAll(".description");
    expect(stopWatchDescriptions).toHaveLength(2);

    expect(stopWatchDescriptions[0].textContent).toBe("Fixed Stopwatch");
    expect(stopWatchDescriptions[1].textContent).toBe("Refactored Stopwatch");

    const stopWatchElements = container.querySelectorAll(".stopwatch");
    expect(stopWatchElements).toHaveLength(2);
  });
});
