import React from "react";
import { formattedSeconds } from "../../utils/time";

interface LapProps {
  index: number;
  value: number;
  onDelete: any;
}

const Lap: React.FunctionComponent<LapProps> = ({ index, value, onDelete }) => (
  <div key={index} className="stopwatch-lap">
    <strong>{index}</strong>/ {formattedSeconds(value)}
    <button className="delete-lap" onClick={onDelete}>
      {" X "}
    </button>
  </div>
);

export default React.memo(Lap);
