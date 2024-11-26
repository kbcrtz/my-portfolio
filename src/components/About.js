import React from "react";
import profileImage from "../profileImage.jpeg";
import TypewriterEffect from "./TypewriterEffect";

const About = () => {
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
    backgroundColor: "#0",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    display: "flex", // Align items side by side
    alignItems: "center", // Vertically align text and image
    //justifyContent: "space-between", // Add space between items
    maxWidth: "800px",
    width: "100%",
    gap: "40px", // Space between text and image
  },
  textContainer: {
    flex: 1, // Allow the text container to take up remaining space
    textAlign: "left",
    fontSize: "20px",
    fontFamily: "'Fira Code', monospace",
  },
  imageContainer: {
    flexShrink: 0, // Prevent image container from shrinking
  },
  image: {
    borderRadius: "50%",
    width: "200px",
    height: "200px",
  },
};

export default About;