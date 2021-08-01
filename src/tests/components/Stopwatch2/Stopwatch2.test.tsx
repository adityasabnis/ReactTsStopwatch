import { render, fireEvent } from "@testing-library/react";
import Stopwatch2 from "../../../components/Stopwatch2";

describe("Stopwatch2", () => {
  describe("initial render", () => {
    it("should correctly render stopwatch2 correctly", () => {
      const { container } = render(<Stopwatch2 initialSeconds={0} />);
      expect(container.querySelector(".stopwatch-timer").textContent).toBe(
        "0:00"
      );

      // Only start button is visible on initial render
      expect(container.querySelector(".start-btn")).toBeTruthy();
      expect(container.querySelector(".stop-btn")).toBeNull();
      expect(container.querySelector(".lap-btn")).toBeNull();
      expect(container.querySelector(".reset-btn")).toBeNull();
    });

    it("should correctly render stopwatch2 with non zero initial time", () => {
      const { container } = render(<Stopwatch2 initialSeconds={100} />);
      expect(container.querySelector(".stopwatch-timer").textContent).toBe(
        "1:40"
      );
    });
  });

  describe("Stopwatch actions", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    describe("Start", () => {
      it("should correctly start the stopwatch", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        jest.advanceTimersByTime(2000);

        expect(container.querySelector(".stopwatch-timer").textContent).toBe(
          "0:02"
        );

        // Should hide start button
        expect(container.querySelector(".start-btn")).toBeNull();

        // Should should Stop and Lap buttons
        expect(container.querySelector(".stop-btn")).toBeTruthy();
        expect(container.querySelector(".lap-btn")).toBeTruthy();

        // Since the stopwatch is ticking, continue hiding Reset button
        expect(container.querySelector(".reset-btn")).toBeNull();
      });

      it("should not start multiple intervals if start is clicked multiple times before tick transition", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        fireEvent.click(startButton);
        fireEvent.click(startButton);
        fireEvent.click(startButton);

        jest.advanceTimersByTime(2000);

        // If the stop watch value is correct after X seconds then only one interval has been started
        expect(container.querySelector(".stopwatch-timer").textContent).toBe(
          "0:02"
        );
      });
    });

    describe("Lap", () => {
      it("should correctly generate laps", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        jest.advanceTimersByTime(2000);

        const lapButton = container.querySelector(".lap-btn");
        expect(lapButton).toBeTruthy();

        // Make 2 laps
        fireEvent.click(lapButton); // Lap at 2 seconds
        jest.advanceTimersByTime(3000);
        fireEvent.click(lapButton); // Lap at 5 seconds
        jest.advanceTimersByTime(1000);

        const laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(2);

        expect(laps[0].textContent).toBe("1/ 0:02 X ");
        expect(laps[1].textContent).toBe("2/ 0:05 X ");
      });

      it("should correctly delete a lap when time is running", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        jest.advanceTimersByTime(2000);

        const lapButton = container.querySelector(".lap-btn");
        expect(lapButton).toBeTruthy();

        // Make 2 laps
        fireEvent.click(lapButton); // Lap at 2 seconds
        jest.advanceTimersByTime(3000);
        fireEvent.click(lapButton); // Lap at 5 seconds
        jest.advanceTimersByTime(1000);

        let laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(2);

        expect(laps[0].textContent).toBe("1/ 0:02 X ");
        expect(laps[1].textContent).toBe("2/ 0:05 X ");

        // Should correctly delete the second lap
        const deleteLapButton = container.querySelectorAll(".delete-lap");
        fireEvent.click(deleteLapButton[1]);
        jest.advanceTimersByTime(1000); // To trigger a render cycle

        // Should only have one lap remaining (0:02)
        laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(1);

        expect(laps[0].textContent).toBe("1/ 0:02 X ");
      });

      it("should correctly delete a lap when time is stopped", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        jest.advanceTimersByTime(2000);

        const lapButton = container.querySelector(".lap-btn");
        expect(lapButton).toBeTruthy();

        // Make 2 laps
        fireEvent.click(lapButton); // Lap at 2 seconds
        jest.advanceTimersByTime(3000);
        fireEvent.click(lapButton); // Lap at 5 seconds
        jest.advanceTimersByTime(1000);

        const stopButton = container.querySelector(".stop-btn");
        expect(stopButton).toBeTruthy();

        // Should move timer to stop mode
        fireEvent.click(stopButton);

        let laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(2);

        expect(laps[0].textContent).toBe("1/ 0:02 X ");
        expect(laps[1].textContent).toBe("2/ 0:05 X ");

        // Should correctly delete the second lap
        const deleteLapButton = container.querySelectorAll(".delete-lap");
        fireEvent.click(deleteLapButton[1]);

        // Should only have one lap remaining (0:02)
        laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(1);

        expect(laps[0].textContent).toBe("1/ 0:02 X ");
      });
    });

    describe("Stop", () => {
      it("should correctly stop timer", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        jest.advanceTimersByTime(2000);

        let currentStopWatchTime = container.querySelector(".stopwatch-timer");
        expect(currentStopWatchTime.textContent).toBe("0:02");

        const stopButton = container.querySelector(".stop-btn");
        expect(stopButton).toBeTruthy();

        fireEvent.click(stopButton);

        // Increment time by 1 second after triggering stopwatch
        jest.advanceTimersByTime(1000);

        // currentStopWatchTime should still be 2 seconds since the stopwatch stop is fired already
        currentStopWatchTime = container.querySelector(".stopwatch-timer");
        expect(currentStopWatchTime.textContent).toBe("0:02");
      });
    });

    describe("Reset", () => {
      it("should correctly reset stopwatch", () => {
        const { container } = render(<Stopwatch2 initialSeconds={0} />);
        const startButton = container.querySelector(".start-btn");

        fireEvent.click(startButton);
        jest.advanceTimersByTime(2000);

        const lapButton = container.querySelector(".lap-btn");
        expect(lapButton).toBeTruthy();

        // Make 2 laps
        fireEvent.click(lapButton); // Lap at 2 seconds
        jest.advanceTimersByTime(3000);
        fireEvent.click(lapButton); // Lap at 5 seconds
        jest.advanceTimersByTime(1000);

        let laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(2);

        expect(laps[0].textContent).toBe("1/ 0:02 X ");
        expect(laps[1].textContent).toBe("2/ 0:05 X ");

        let currentStopWatchTime = container.querySelector(".stopwatch-timer");
        expect(currentStopWatchTime.textContent).toBe("0:06");

        const stopButton = container.querySelector(".stop-btn");
        expect(stopButton).toBeTruthy();

        fireEvent.click(stopButton);

        // Reset button should be visible
        const resetButton = container.querySelector(".reset-btn");
        expect(resetButton).toBeTruthy();

        fireEvent.click(resetButton);

        // Current timer should be reset to 0.00
        currentStopWatchTime = container.querySelector(".stopwatch-timer");
        expect(currentStopWatchTime.textContent).toBe("0:00");

        // All laps should be deleted
        laps = container.querySelectorAll(".stopwatch-lap");
        expect(laps).toHaveLength(0);
      });
    });
  });
});
