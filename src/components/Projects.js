import React from "react";
import TypewriterEffect from "./TypewriterEffect";


const Projects = () => {
    const descTextOne = `We designed and built a fully functional 8-bit computer within Minecraft!
    
Featuring a custom CPU architecture, the system executes basic arithmetic and logic operations using an instruction set my partner and I developed.`;

        return (
        <section id="projects" style={styles.section}>
            <h2>Projects</h2>
            <div style={styles.projectList}>
                <div style={styles.projectItem}>
                <a href="https://youtu.be/LiJs6P6fOBA?si=zh0-OXEJmng6N1ix" target="_blank" rel="noopener noreferrer" style={styles.projectLink}>
                        <img src="mcThumbnail.png" alt="My 8-bit Minecraft Computer" style={styles.projectImage} />
                        <h3>My 8-bit Minecraft Computer</h3>
                    </a>
                    <TypewriterEffect
            text={descTextOne}
            speed={0}
            fontFamily="'Fira Code', monospace"
          />
                </div>
                <div style={styles.projectItem}>
                    <h3>Project 2</h3>
                    <p>Description of project</p>
                </div>
                <div style={styles.projectItem}>
                    <h3>Project 3</h3>
                    <p>Description of project</p>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '40px',
        textAlign: 'center',
        fontFamily: "'Fira Code', monospace",
    },
    projectList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    projectItem: {
        width: '300px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign:'left',
    },
    projectImage: {
        width: "100%", // Make sure the image takes the full width
        height: "200px", // Define a height for the image
        objectFit: "cover", // Ensures the image fills the box while keeping aspect ratio
        borderRadius: "8px",
    },
    projectLink: {
        textDecoration: "none",
        color: "inherit",
    },

};

export default Projects;