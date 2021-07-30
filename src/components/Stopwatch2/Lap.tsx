import { Component, ClassAttributes } from "react";
import { formattedSeconds } from "../../utils/time";

interface LapProps extends ClassAttributes<Lap> {
  index: number;
  value: number;
  onDelete: any;
}

class Lap extends Component<LapProps> {
  render() {
    const { index, value, onDelete } = this.props;

    return (
      <div key={index} className="stopwatch-lap">
        <strong>{index}</strong>/ {formattedSeconds(value)}
        <button onClick={onDelete}> X </button>
      </div>
    );
  }
}

export default Lap;
