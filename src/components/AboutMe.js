import React from "react";

const AboutMe = () => {
    return (
        <section id="AboutMe" style={styles.section}>
            <h2 style={styles.header}>About Me</h2>
            <div style={styles.text}>
                <p>
                    Hi, I’m Kobe, a sophomore at Pacific Lutheran University with a passion for music, nature, and cars. I enjoy exploring the outdoors, working on cars, and immersing myself in creative and technical challenges.
                </p>
                <p>
                    Currently, I’m pursuing a degree in Computer Science, and I aspire to become a Software Engineer. I’m eager to build innovative and impactful software solutions that make a difference. My goal is to continuously learn, grow, and contribute to exciting projects in the tech industry.
                </p>
            </div>
        </section>
    );
};

const styles = {
    section: {
        padding: '40px',
        textAlign: 'center', // Center the header
    },
    text: {
        textAlign: 'left', // Keep text inside the block aligned left
        maxWidth: '400px', // Limit the width of the text block
        fontFamily: "'Fira Code', monospace",
        lineHeight: '1.8',

    },
    header: {
        textAlign: 'left',
        fontFamily: "'Fira Code', monospace"
    },
};

export default AboutMe;