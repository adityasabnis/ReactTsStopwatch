import { Component, ClassAttributes } from "react";

const formattedSeconds = (sec: number) =>
  // Can use `` interpolation instead of using + to form result string
  // Also can be moved to util as this can be a re-usable helper
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

// StateType is any instead of having a defined type structure
// Fixed in Refactored StopWatch
class Stopwatch extends Component<StopwatchProps, any> {
  incrementer: any;
  laps: any[];

  constructor(props: StopwatchProps) {
    super(props);

    // Explicitly setting incrementer = null for conditional check in handleStartClick (defaults to undefined)
    this.incrementer = null;
    this.laps = [];

    this.state = {
      secondsElapsed: props.initialSeconds,
      // Same stopwatch result can be derived without `lastClearedIncrementer` additional state attribute
      // Fixed in Refactored StopWatch
      lastClearedIncrementer: null,
    };

    // Bind current this to the stopwatch functions
    // As functions declared in JS with function keyword use the `this` from where they are executed and not where they are defined
    // Such thing can be mitigated with arrow functions (Implemented in Refactored StopWatch using arrow functions)
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleLabClick = this.handleLabClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentWillUnmount() {
    if (this.incrementer) {
      clearInterval(this.incrementer);
    }
  }

  handleStartClick() {
    // If you click multiple times before the button transition, multiple times are set in motion
    // Following check only start a new interval if incrementer === lastClearedIncrementer
    // which only occurs on the initial state and when the stopwatch is stopped
    if (this.incrementer !== this.state.lastClearedIncrementer) return;

    this.incrementer = setInterval(
      () =>
        // Since setState is async, we should use the prevState value instead of directly accessing it from this.state
        this.setState((prevState: any) => ({
          secondsElapsed: prevState.secondsElapsed + 1,
        })),
      1000
    );
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    this.laps = [];
    this.setState({
      secondsElapsed: 0,
    });
  }

  // Typo `handleLabClick` -> `handleLapClick`
  // Fixed in Refactored StopWatch
  handleLabClick() {
    this.laps = this.laps.concat([this.state.secondsElapsed]);
  }

  handleDeleteClick(index: number) {
    return () => {
      this.laps.splice(index, 1);
      const { secondsElapsed, lastClearedIncrementer } = this.state;

      if (secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer) {
        return this.forceUpdate();
      }
    };
  }
  render() {
    const { secondsElapsed, lastClearedIncrementer } = this.state;

    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {/* The Action buttons can be rendered in a separate function for readability (Fixed in Refactored StopWatch) */}
        {secondsElapsed === 0 || this.incrementer === lastClearedIncrementer ? (
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
        {secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer ? (
          <button
            className="lap-btn"
            type="button"
            onClick={this.handleLabClick}
          >
            Lap
          </button>
        ) : null}
        {secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer ? (
          <button
            className="reset-btn"
            type="button"
            onClick={this.handleResetClick}
          >
            Reset
          </button>
        ) : null}
        <div className="stopwatch-laps">
          {/* // Lap rendering can be component of it's own and can be memoized to only render when lap count changes */}
          {this.laps &&
            this.laps.map((lap, i) => (
              <Lap
                key={`lap-item-${i + 1}`} // Fixes console error: Each child in a list should have a unique "key" prop.
                index={i + 1}
                lap={lap}
                onDelete={this.handleDeleteClick(i)}
              />
            ))}
        </div>
      </div>
    );
  }
}

// Can be a separate component in it's own file for cleaner impl
// Fixed in Refactored StopWatch
const Lap = (props: { index: number; lap: number; onDelete: any }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}
    <button className="delete-lap" onClick={props.onDelete}>
      {" X "}
    </button>
  </div>
);

export default Stopwatch;
