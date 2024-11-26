import React from "react";
import profileImage from "../profileImage.jpeg";
import TypewriterEffect from "./TypewriterEffect";

const About = () => {
  const aboutText = `function kobeCortez() {\n  full-stack software engineer\n}`;

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
          <img src={profileImage} alt="Kobe Cortez" style={styles.image} />
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "40px 20px",
    backgroundColor: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row", // Default to side-by-side layout
    alignItems: "center", // Vertically align items
    justifyContent: "space-between", // Space between text and image
    maxWidth: "900px",
    width: "100%",
    gap: "40px", // Space between text and image
  },
  textContainer: {
    flex: 1,
    textAlign: "left",
    fontSize: "18px",
    fontFamily: "'Fira Code', monospace",
  },
  imageContainer: {
    flexShrink: 0, // Prevent shrinking
    textAlign: "center", // Center image if it wraps below
  },
  image: {
    borderRadius: "50%",
    width: "175px",
    height: "175px",
  },
  "@media (max-width: 768px)": {
    container: {
      flexDirection: "column", // Stack items vertically on small screens
      textAlign: "center", // Center align content when stacked
    },
    imageContainer: {
      marginTop: "20px", // Add spacing when stacked
    },
  },
};

export default About;