import React, { Component, ClassAttributes } from "react";
import { formattedSeconds } from "../../utils/time";
import Laps from "./Laps";

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

type StopwatchState = {
  secondsElapsed: number;
};

class Stopwatch extends Component<StopwatchProps, StopwatchState> {
  incrementer: any;
  laps: Array<number>;

  constructor(props: StopwatchProps) {
    super(props);

    this.incrementer = null;
    this.laps = [];

    this.state = {
      secondsElapsed: props.initialSeconds,
    };
  }

  componentWillUnmount() {
    if (this.incrementer) clearInterval(this.incrementer);
  }

  handleStartClick = () => {
    // If you click multiple times before the button transition, multiple times are set in motion
    // Only start an interval if incrementer is null
    // Which is on initial state and when explicitly set to null in stop
    if (this.incrementer !== null) return;

    this.incrementer = setInterval(() => {
      // Since setState is async, we should use the prevState value instead of directly accessing it from this.state
      this.setState((prevState: any) => ({
        secondsElapsed: prevState.secondsElapsed + 1,
      }));
    }, 1000);
  };

  handleStopClick = () => {
    clearInterval(this.incrementer);
    this.incrementer = null;
    this.forceUpdate();
  };

  handleResetClick = () => {
    clearInterval(this.incrementer);
    this.laps = [];
    this.setState({
      secondsElapsed: 0,
    });
  };

  handleLapClick = () => {
    this.laps = this.laps.concat([this.state.secondsElapsed]);
  };

  handleDeleteClick = (index: number) => {
    return () => {
      this.laps.splice(index, 1);
      // Since we have memoized Laps component, the re-render is not triggered if will only splice without changing the value array reference
      this.laps = [...this.laps];

      // Need to re-render to delete laps when timer is stopped
      // As render is only called as long as the timer is going since it is a state attribute
      if (this.incrementer === null) {
        this.forceUpdate();
      }
    };
  };

  renderActionButtons = () => {
    const { secondsElapsed } = this.state;

    return (
      <React.Fragment>
        {secondsElapsed === 0 || this.incrementer === null ? (
          <button
            type="button"
            className="start-btn"
            onClick={this.handleStartClick}
          >
            Start
          </button>
        ) : (
          <button
            type="button"
            className="stop-btn"
            onClick={this.handleStopClick}
          >
            Stop
          </button>
        )}

        {secondsElapsed !== 0 && this.incrementer !== null ? (
          <button
            type="button"
            className="lap-btn"
            onClick={this.handleLapClick}
          >
            Lap
          </button>
        ) : null}
        {secondsElapsed !== 0 && this.incrementer === null ? (
          <button
            type="button"
            className="reset-btn"
            onClick={this.handleResetClick}
          >
            Reset
          </button>
        ) : null}
      </React.Fragment>
    );
  };

  render() {
    const { secondsElapsed } = this.state;
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {this.renderActionButtons()}
        <Laps laps={this.laps} handleDeleteClick={this.handleDeleteClick} />
      </div>
    );
  }
}

export default Stopwatch;
