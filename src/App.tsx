import Stopwatch from "./components/Stopwatch"; // Fixed Stopwatch
import Stopwatch2 from "./components/Stopwatch2"; // Refactored Stopwatch
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="container-left">
          <div className="description">Fixed Stopwatch</div>
          <Stopwatch initialSeconds={0} />
        </div>
        <div className="container-right">
          <div className="description">Refactored Stopwatch</div>
          <Stopwatch2 initialSeconds={0} />
        </div>
      </div>
    </div>
  );
};

export default App;
