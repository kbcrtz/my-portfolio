import React from "react";
import TypewriterEffect from "./TypewriterEffect";

const AboutMe = () => {
  const aboutTextOne =
    "I'm Kobe Cortez, a Computer Science student who loves building things, breaking things, and figuring out how to make them better. I'm into cars, music, and anything that pushes me to think differently and stay creative. \n \nI got into coding because I like turning ideas into something real. There's something satisfying about solving problems line by line until everything clicks. That same mindset carries over when I'm under the hood of my car, understanding how things work, improving them, and seeing the results firsthand.\n \nI love making connections with people and learning from different perspectives. Sharing my journey online has become a passion of mine whether it’s posting about projects I’m working on, cars I’m building, or lessons I’ve learned along the way. I enjoy being part of a community where ideas, creativity, and motivation are shared freely. \n \nNow, I'm focused on growing as a developer and building projects that actually matter. My goal is to become a Software Engineer who creates useful, meaningful technology that blends creativity, logic, and impact.";
  return (
    <section id="AboutMe" style={styles.section}>
      <h2 style={styles.header}>About Me</h2>
      <div style={styles.text}>
        <TypewriterEffect
          text={aboutTextOne}
          speed={10}
          fontFamily="'Fira Code', monospace"
        />
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "40px",
    textAlign: "center", // Center the header
  },
  text: {
    textAlign: "left", // Keep text inside the block aligned left
    maxWidth: "400px", // Limit the width of the text block
    fontFamily: "'Fira Code', monospace",
    lineHeight: "2.0",
  },
  header: {
    textAlign: "left",
    fontFamily: "'Fira Code', monospace",
  },
};

export default AboutMe;
