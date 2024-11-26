import React from "react";
import profileImage from "../profileImage.jpeg";
import TypewriterEffect from "./TypewriterEffect";

const Title = () => {
  const aboutText = `function kobeCortez() {\n \n  full-stack software engineer\n \n}`;

  return (
    <section id="about" style={styles.section}>
      <div style={styles.container}>
        {/* Typewriter Text */}
        <div style={styles.textContainer}>
          <TypewriterEffect
            text={aboutText}
            speed={50}
            fontFamily="'Fira Code', monospace"
          />
        </div>
        {/* Profile Image */}
        <div style={styles.imageContainer}>
          <img
            src={profileImage}
            alt="Kobe Cortez"
            style={styles.image}
          />
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "40px 20px",
    backgroundColor: "#0", // Keep original background
    display: "flex",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    alignItems: "center", // Vertically center items
    justifyContent: "center", // Horizontally center the entire container
    maxWidth: "800px",
    width: "100%",
    gap: "40px", // Space between text and image
    flexWrap: "wrap", // Allow wrapping for smaller screens
  },
  textContainer: {
    flex: 1, // Allow the text to take up the remaining space
    textAlign: "left",
    fontSize: "25px",
    fontFamily: "'Fira Code', monospace",
  },
  imageContainer: {
    flexShrink: 1, // Allow image to shrink when necessary
    textAlign: "center", // Center the image when it moves below the text
  },
  image: {
    borderRadius: "50%",
    width: "250px", // Original size
    height: "250px", // Original size
    maxWidth: "100%", // Prevent overflow
    transition: "width 0.3s, height 0.3s", // Smooth resizing
  },
  "@media (max-width: 768px)": {
    container: {
      flexDirection: "column", // Stack vertically on smaller screens
    },
    imageContainer: {
      marginTop: "20px", // Add space between text and image
    },
  },
};

export default Title;