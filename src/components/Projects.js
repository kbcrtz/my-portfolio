import React, { useState, useRef, useEffect } from "react";
import TypewriterEffect from "./TypewriterEffect";

// Project data configuration
const projectsData = [
  {
    id: 1,
    title: "My 8-bit Minecraft Computer",
    category: "Hardware/Game Design",
    dateRange: "Fall 2023",
    image: "mcThumbnail.png",
    link: "https://youtu.be/LiJs6P6fOBA?si=zh0-OXEJmng6N1ix",
    description: `We designed and built a fully functional 8-bit computer within Minecraft!

Featuring a custom CPU architecture, the system executes basic arithmetic and logic operations using an instruction set my partner and I developed.`,
  },
  {
    id: 2,
    title: "White Pass Ski Resort Digital System",
    category: "Full Stack Development",
    dateRange: "Summer 2024",
    image:
      "https://media.licdn.com/dms/image/v2/D5622AQGnDjKcY62K8g/feedshare-shrink_800/B56Zm6n2BxHAAg-/0/1759772639249?e=1764201600&v=beta&t=vQMlMpxRxq03mesYBzXTyR3_RYer7kptYjSKbl8Ji3U",
    link: "https://www.linkedin.com/posts/kbcrtz_over-the-summer-i-had-the-opportunity-to-activity-7381021453233639424-kb72?utm_source=share&utm_medium=member_desktop",
    description: `Developed a digital run tracking and scheduling system for White Pass Ski Resort for over 200 ski patrollers. Using React, TypeScript, and Firebase, we created an intuitive interface, optimizing database performance for reliability at scale.`,
  },
  {
    id: 3,
    title: "Connect 4 AI using Deep Q-Learning",
    category: "Machine Learning/AI",
    dateRange: "Winter 2024",
    image: "ConnectFourImage.png",
    link: "https://github.com/kbcrtz/connect-4-neural-net",
    description: `A reinforcement learning project that trains a neural network to play Connect 4 through self-play. Built with PyTorch, the AI uses Deep Q-Networks (DQN) with experience replay to learn optimal game strategies.

Trained over 176,000 episodes, the agent demonstrates strong strategic play including threat recognition and tactical positioning. Features include GPU acceleration, saved model checkpoints, and an interactive CLI to play against the trained AI.`,
  },
];

const Projects = () => {
  const [expandedCards, setExpandedCards] = useState({});
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const [centerIndex, setCenterIndex] = useState(0);

  // Create infinite scroll by duplicating items
  const infiniteProjects = [...projectsData, ...projectsData, ...projectsData];

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCardClick = (index, id) => {
    // If card is not in center, scroll it to center
    if (index !== centerIndex) {
      const item = itemRefs.current[index];
      if (item && scrollRef.current) {
        const container = scrollRef.current;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const containerCenter = container.clientWidth / 2;
        const scrollTo = itemCenter - containerCenter;

        container.scrollTo({
          left: scrollTo,
          behavior: "smooth",
        });
      }
    } else {
      // If card is in center, toggle it
      toggleCard(id);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Start at the middle set of projects
    setTimeout(() => {
      const initialScroll = scrollContainer.scrollWidth / 3;
      scrollContainer.scrollLeft = initialScroll;
    }, 0);

    let scrollTimeout;
    const handleScroll = () => {
      // Debounce the scroll handler to reduce glitching
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const container = scrollContainer;
        const containerCenter =
          container.scrollLeft + container.clientWidth / 2;

        // Find the item closest to center
        let closestIndex = 0;
        let closestDistance = Infinity;

        itemRefs.current.forEach((item, index) => {
          if (item) {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const distance = Math.abs(containerCenter - itemCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          }
        });

        setCenterIndex(closestIndex);

        // Infinite scroll logic - wrap around (only after scroll stops)
        const scrollWidth = container.scrollWidth;
        const scrollLeft = container.scrollLeft;
        const sectionWidth = scrollWidth / 3;

        if (scrollLeft <= 10) {
          container.scrollLeft = scrollLeft + sectionWidth;
        } else if (scrollLeft >= scrollWidth - container.clientWidth - 10) {
          container.scrollLeft = scrollLeft - sectionWidth;
        }
      }, 50);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const getItemStyle = (index) => {
    const distance = Math.abs(index - centerIndex);
    const isCentered = index === centerIndex;

    // Gradual scaling and blurring based on distance
    const scale = Math.max(0.7, 1 - distance * 0.15);
    const blur = Math.min(distance * 2, 5);
    const opacity = Math.max(0.5, 1 - distance * 0.2);

    return {
      ...styles.projectItem,
      transform: `scale(${scale})`,
      filter: `blur(${blur}px)`,
      opacity: opacity,
      transition: "all 0.3s ease",
      cursor: isCentered ? "pointer" : "grab",
      pointerEvents: "auto",
    };
  };

  return (
    <section id="projects" style={styles.section}>
      <style>
        {`
          .projects-carousel-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <h2>Projects</h2>
      <div
        ref={scrollRef}
        className="projects-carousel-container"
        style={styles.projectList}
      >
        {infiniteProjects.map((project, index) => {
          const isExpanded = expandedCards[`${project.id}-${index}`];
          return (
            <div
              key={`${project.id}-${index}`}
              ref={(el) => (itemRefs.current[index] = el)}
              style={getItemStyle(index)}
              onClick={() => handleCardClick(index, `${project.id}-${index}`)}
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.projectLink}
                onClick={(e) => {
                  // Only allow link click if card is centered
                  if (index !== centerIndex) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={styles.projectImage}
                />
              </a>
              <div style={styles.headerSection}>
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <span style={styles.chevron}>{isExpanded ? "▼" : "▶"}</span>
              </div>
              {isExpanded && (
                <div style={styles.descriptionContainer}>
                  <h4 style={styles.category}>{project.category}</h4>
                  <p style={styles.dateRange}>{project.dateRange}</p>
                  <TypewriterEffect
                    text={project.description}
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
    textAlign: "Left",
    fontFamily: "'Fira Code', monospace",
  },
  projectList: {
    display: "flex",
    overflowX: "scroll",
    gap: "20px",
    padding: "40px 20px",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge
  },
  projectItem: {
    flex: "0 1 400px",
    minWidth: "270px",
    maxWidth: "500px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "left",
    transition: "box-shadow 0.3s ease",
    scrollSnapAlign: "center",
  },
  projectImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  projectLink: {
    textDecoration: "none",
    color: "inherit",
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    userSelect: "none",
  },
  projectTitle: {
    margin: "10px 0",
    fontFamily: "'Fira Code', monospace",
  },
  category: {
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

export default Projects;
