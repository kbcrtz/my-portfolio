import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TypewriterEffect from "./TypewriterEffect";

const FONT_FAMILY = "'Fira Code', monospace";
const NAV_TRIGGER_ZONE = 100;

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
  {
    id: 4,
    title: "Gear Fitness",
    category: "Mobile Development",
    dateRange: "Fall 2025-Present",
    image:
      "https://private-user-images.githubusercontent.com/95990818/538922418-13036473-e0c7-4126-8bd4-68a00067088d.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzE0NjA2NzEsIm5iZiI6MTc3MTQ2MDM3MSwicGF0aCI6Ii85NTk5MDgxOC81Mzg5MjI0MTgtMTMwMzY0NzMtZTBjNy00MTI2LThiZDQtNjhhMDAwNjcwODhkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAyMTklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMjE5VDAwMTkzMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI2MGUwNDA1NmFmMjQwODk3NmZhNGZhNDc4YWMzYjMzYjZjOWViYTdiMGEwYzU3YWYyNTcwMDk0MTY1NmYyNWEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.-DCQcqo6QiE1Js0oxKZe28RiaT9jrBEO0D5eTKu2-rc",
    link: "https://github.com/gear-fitness/gear-fitness-app",
    description: `Built a responsive portfolio website using React, TypeScript, and Material UI. Deployed on Vercel.`,
  },
];

const Projects = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const syncBounds = (swiper) => {
    setIsAtStart(swiper.isBeginning);
    setIsAtEnd(swiper.isEnd);
  };
  useEffect(() => {
    const onMouseMove = (e) => {
      setShowPrev(e.clientX < NAV_TRIGGER_ZONE);
      setShowNext(e.clientX > window.innerWidth - NAV_TRIGGER_ZONE);
    };
    const onMouseLeave = () => {
      setShowPrev(false);
      setShowNext(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const handleCardClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedProject = projectsData.find((p) => p.id === selectedId);

  return (
    <section id="projects" style={styles.section}>
      <style>
        {`
          .projects-swiper { overflow: visible !important; --swiper-navigation-sides-offset: 0px; }
          .project-card {
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
            background: #111;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .project-card:hover {
            transform: scale(1.06);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
            z-index: 10;
            position: relative;
            outline: 3px solid #000;
            outline-offset: 3px;
          }
          .has-selection .project-card:hover {
            outline: none;
          }
          .project-card:focus-visible {
            outline: 2px solid #000;
            outline-offset: 3px;
          }
          .swiper-button-next, .swiper-button-prev {
            color: #000 !important;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
          }
          .swiper-button-next.swiper-button-disabled,
          .swiper-button-prev.swiper-button-disabled {
            opacity: 0 !important;
          }
          .show-prev .swiper-button-prev,
          .show-next .swiper-button-next {
            opacity: 1;
            pointer-events: auto;
          }
        `}
      </style>
      <h2>Projects</h2>
      <div
        style={{ padding: "10px" }}
        className={[
          showPrev && !isAtStart ? "show-prev" : "",
          showNext && !isAtEnd ? "show-next" : "",
          selectedId ? "has-selection" : "",
        ].join(" ")}
      >
        <Swiper
          className="projects-swiper"
          modules={[Navigation]}
          navigation={true}
          slidesPerView="auto"
          spaceBetween={20}
          style={{ padding: "2px 8px" }}
          onSwiper={syncBounds}
          onSlideChange={syncBounds}
        >
          {projectsData.map((project) => (
            <SwiperSlide key={project.id} style={{ width: "280px" }}>
              <div
                className="project-card"
                tabIndex={0}
                role="button"
                aria-pressed={selectedId === project.id}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleCardClick(project.id);
                }}
                style={{
                  outline:
                    selectedId === project.id ? "3px solid #000" : "none",
                  outlineOffset: "3px",
                  boxShadow:
                    selectedId === project.id
                      ? "0 6px 20px rgba(0,0,0,0.3)"
                      : "none",
                }}
                onClick={() => handleCardClick(project.id)}
              >
                <div style={{ position: "relative", aspectRatio: "16/10" }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    style={styles.thumbnail}
                  />
                  <div style={styles.gradientOverlay}>
                    <span style={styles.categoryBadge}>{project.category}</span>
                    <p style={styles.overlayTitle}>{project.title}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedProject && (
        <div style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            <h3 style={styles.detailTitle}>{selectedProject.title}</h3>
            <a
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.detailLink}
            >
              View Project →
            </a>
          </div>
          <p style={styles.detailMeta}>
            {selectedProject.category} · {selectedProject.dateRange}
          </p>
          <TypewriterEffect
            key={selectedId}
            text={selectedProject.description}
            speed={0}
            fontFamily={FONT_FAMILY}
          />
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    padding: "40px",
    textAlign: "left",
    fontFamily: FONT_FAMILY,
  },
  thumbnail: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
    padding: "24px 10px 10px",
  },
  categoryBadge: {
    display: "block",
    color: "rgba(255,255,255,0.65)",
    fontSize: "10px",
    fontFamily: FONT_FAMILY,
    marginBottom: "2px",
  },
  overlayTitle: {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
    margin: "0",
    fontFamily: FONT_FAMILY,
  },
  detailPanel: {
    marginTop: "16px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailTitle: {
    margin: "0",
    fontFamily: FONT_FAMILY,
  },
  detailLink: {
    fontSize: "14px",
    color: "inherit",
    textDecoration: "none",
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },
  detailMeta: {
    fontSize: "13px",
    color: "#888",
    margin: "4px 0 12px",
    fontFamily: FONT_FAMILY,
  },
};

export default Projects;
