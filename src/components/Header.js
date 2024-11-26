import React from 'react';

const Header = () => {
    return(
        <header style={styles.header}>
            <a href='https://kobecortez.com' style={styles.logo}>
            <img
                src='/star.PNG'
                alt='site logo'
                style={styles.image}
            />
            </a> 
            <nav style={styles.nav}>
                <a href="#about" style={styles.link}>about</a>
                <a href="#projects" style={styles.link}>projects</a>
                <a href='#contact' style={styles.link}>contact</a>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        alignItems:'center',
        justifyContent: 'space-between',
        padding: '20px',
        backgroundColor: '#fff',
        color: '#000'
    },
    title: {
        textDecoration: 'none', // Remove the underline
        color: 'inherit',       // Use the text color of the parent element
        fontWeight: 'bold',     // Optional, make it bold
    },
    nav: {
        display: 'flex',
        gap: '15px',
        fontFamily: "'Fira Code', monospace",
    },
    link:{
        color: 'inherit',
        textDecoration: 'none',
        textAlign:'center',
        fontSize: '18px'
    },
    logo: {
        textDecoration: 'none', // Remove link underline
    },
    image: {
        width: '70px',  // Adjust size of the image
        height: '70px', // Ensure proportions are consistent
        objectFit: 'contain', // Keeps image aspect ratio
        transform: 'scaleX(-1)',
    },
}
export default Header;