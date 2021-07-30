import React from "react";
import Lap from "./Lap";

interface LapsProps {
  laps: Array<number>;
  handleDeleteClick: any;
}

const Laps: React.FunctionComponent<LapsProps> = ({
  laps,
  handleDeleteClick,
}) => (
  <div className="stopwatch-laps">
    {laps.length
      ? laps.map((lap, i) => (
          <Lap
            key={`lap-item-${i + 1}`}
            index={i}
            value={lap}
            onDelete={handleDeleteClick(i)}
          ></Lap>
        ))
      : null}
  </div>
);

export default React.memo(Laps);
