import React from "react";
import profileImage from '/Users/kbcrtz/GitRepos/my-portfolio/src/profileImage.jpeg'

const About = () => {
    return (
        <section id="about" style={styles.section}>
             <img src={profileImage} alt="profileImage" style={styles.image}/>
            <h3>About Me</h3>
            <p>
                Hey, I'm Kobe Cortez, and this is my portfolio.
            </p>
        </section>
    );
};

const styles = { 
    section:{
        padding: '40px',
        textAlign: 'center'
    },
    image: {
        borderRadius: '50%',
        width:'175px',
        height:'175px',
    },
};

export default About;