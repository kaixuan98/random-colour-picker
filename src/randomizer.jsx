import { useState, useEffect } from "react";
import "./App.css";

const COLORS = ["Black", "Brown", "Pink", "Blue"];
const WAIT_TIME_MS = 300; // 4 seconds

export default function RandomPicker() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPicking, setIsPicking] = useState(false);

  const pickRandom = () => {
    if (isPicking) return;

    let options = [...COLORS];

    const lastTwo = history.slice(-2);
    if (lastTwo.length === 2 && lastTwo[0] === lastTwo[1]) {
      options = options.filter((c) => c !== lastTwo[0]);
    }

    setIsPicking(true);
    setCurrent(null);

    setTimeout(() => {
      const choice = options[Math.floor(Math.random() * options.length)];
      setCurrent(choice);
      setHistory((prev) => [choice, ...prev]);
      setIsPicking(false);
    }, WAIT_TIME_MS);
  };

  const resetHistory = () => {
    setHistory([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        pickRandom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPicking]);

  const getColorHex = (color) => {
    switch (color) {
      case "Black":
        return "#000000";
      case "Brown":
        return "#8B4513";
      case "Pink":
        return "#FFC0CB";
      case "Blue":
        return "#0000FF";
      default:
        return "#fff";
    }
  };

  const getTextColor = (bgColor) => {
    // Simple contrast: use white text for dark backgrounds, black for light
    const darkColors = ["#000000", "#8B4513", "#0000FF"];
    return darkColors.includes(bgColor) ? "white" : "black";
  };

  return (
    <div className="container">
      <div className="box">
        {/* Left Column */}
        <div className="left">
          <div className="header">🎨 Random Colour Picker</div>

          <div>
            <p>Available colours:</p>
            <div>
              {COLORS.map((c) => (
                <span
                  key={c}
                  className={`color-item ${current === c ? "selected" : ""}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <button
            className={`pick-button ${isPicking ? "disabled" : ""}`}
            onClick={pickRandom}
            disabled={isPicking}
          >
            {isPicking ? "Picking..." : "Pick Random Colour"}
          </button>

          {current && (
            <div className="selected-container">
              <div className="selected-text">Selected: {current}</div>
              <div
                className="selected-color-rect"
                style={{ backgroundColor: getColorHex(current) }}
              ></div>
            </div>
          )}
        </div>

        {/* Right Column (History) */}
        <div className="right">
          <div className="history-header">History</div>
          <button className="reset-button" onClick={resetHistory}>
            Reset History
          </button>
          <ul className="history-list">
            {history.map((item, index) => {
              const bgColor = getColorHex(item);
              const textColor = getTextColor(bgColor);
              return (
                <li
                  key={index}
                  className="history-item"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: "5px",
                    marginBottom: "3px",
                    borderRadius: "5px",
                  }}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
