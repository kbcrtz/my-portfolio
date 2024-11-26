import React, { useState, useEffect } from "react";

const TypewriterEffect = ({ text, speed = 100, fontFamily = "monospace" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect logic
  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [index, text, speed]);

  // Cursor blinking logic
  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(cursorBlink);
  }, []);

  // Format text with line breaks and keep cursor at the right spot
  const formattedText = displayedText.split("\n").map((line, i, arr) => (
    <div key={i} style={{ display: "block" }}>
      {line}
      {i === arr.length - 1 && showCursor && <span>|</span>}
    </div>
  ));

  return (
    <div style={{ fontFamily, whiteSpace: "pre-wrap" }}>
      {formattedText}
    </div>
  );
};

export default TypewriterEffect;