import React from "react";

const About = () => {
    return (
        <section id="about" style={styles.section}>
            <h2>About Me</h2>
            <p>
                Hey, I'm Kobe Cortez, 
            </p>
        </section>
    );
};

const styles = { 
    section:{
        padding: '40px',
        textAlign: 'center'
    }
};

export default About;