import React from "react";

const Projects = () => {
    return (
        <section id="projects" style={styles.section}>
            <h2>Projects</h2>
            <div style={styles.projectList}>
                <div style={styles.projectItem}>
                    <h3>Project 1</h3>
                    <p>Description of project</p>
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
        width: '400px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign:'left',
    },

};

export default Projects;