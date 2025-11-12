import React, { useState } from "react";
import TypewriterEffect from "./TypewriterEffect";

// Experience data configuration
const experienceData = [
  {
    id: 1,
    company: "White Pass Ski Patrol, White Pass Ski Area",
    role: "Software Development Intern",
    dateRange: "June 2025 - Present",
    image: "white_pass_logo-removebg-preview.png",
    link: "https://www.skiwhitepass.com/",
    description: `Built scheduling feature for React web app serving 200+ patrollers with grid-based interface, replacing manual system and enabling efficient run assignment tracking through scalable, maintainable code following best practices.

Optimized database access patterns and implemented monitoring to reduce redundant Firebase queries, lowering operational costs and improving application responsiveness through performance troubleshooting.

Collaborated in agile environment with CI/CD practices, participating in code reviews and maintaining technical documentation while demonstrating operational excellence through production issue resolution.`,
  },
  {
    id: 2,
    company: "Technology Access Foundation",
    role: "Instructor, Web Development",
    dateRange: "January 2025 - May 2025",
    image:
      "https://assets.tiltify.com/uploads/cause/avatar/4840/blob-e684b81b-babf-47dc-bdad-5cc978193600.png",
    link: "https://techaccess.org/",
    description: `Taught 26 students HTML, CSS, and JavaScript, communicating complex technical concepts clearly and fostering analytical problem-solving skills through iterative design and project-based learning.`,
  },
  {
    id: 3,
    company: "Pacific Lutheran University",
    role: "President, Computer Science Club",
    dateRange: "August 2024 - Present",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3e/SealofPLU.png",
    link: "https://www.plu.edu/",
    description: `Led 50+ member club organizing technical workshops, speaker events, and mock interviews for professional development.`,
  },
];

const Experience = () => {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="experience" style={styles.section}>
      <h2>Experience</h2>
      <div style={styles.experienceList}>
        {experienceData.map((experience) => {
          const isExpanded = expandedCards[experience.id];
          return (
            <div key={experience.id} style={styles.experienceItem}>
              <a
                href={experience.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.experienceLink}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={experience.image}
                  alt={experience.company}
                  style={styles.experienceImage}
                />
              </a>
              <div
                onClick={() => toggleCard(experience.id)}
                style={styles.headerSection}
              >
                <h3 style={styles.roleTitle}>{experience.role}</h3>
                <span style={styles.chevron}>{isExpanded ? "▼" : "▶"}</span>
              </div>
              {isExpanded && (
                <div style={styles.descriptionContainer}>
                  <h4 style={styles.company}>{experience.company}</h4>
                  <p style={styles.dateRange}>{experience.dateRange}</p>
                  <TypewriterEffect
                    text={experience.description}
                    speed={0}
                    fontFamily="'Fira Code', monospace"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "40px",
    textAlign: "Center",
    fontFamily: "'Fira Code', monospace",
  },
  experienceList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  experienceItem: {
    width: "300px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "left",
    transition: "box-shadow 0.3s ease",
  },
  experienceImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  experienceLink: {
    textDecoration: "none",
    color: "inherit",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  roleTitle: {
    margin: "0 0 5px 0",
    fontFamily: "'Fira Code', monospace",
  },
  company: {
    fontSize: "16px",
    fontWeight: "normal",
    margin: "5px 0",
    color: "#555",
    fontFamily: "'Fira Code', monospace",
  },
  dateRange: {
    fontSize: "14px",
    color: "#888",
    margin: "5px 0 10px 0",
    fontFamily: "'Fira Code', monospace",
  },
  chevron: {
    fontSize: "20px",
    color: "#555",
    marginLeft: "10px",
    transition: "transform 0.3s ease",
  },
  descriptionContainer: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #eee",
  },
};

export default Experience;
