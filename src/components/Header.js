import React from 'react';

const Header = () => {
    return(
        <header style={styles.header}>
            <a href='https://kobecortez.com' style={styles.title}>
                <h3>Kobe Cortez</h3>
                </a>
            <nav style={styles.nav}>
                <a href="#about" style={styles.link}>About</a>
                <a href="#projects" style={styles.link}>Projects</a>
                <a href='#contact' style={styles.link}>Contact</a>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    },
    link:{
        color: 'inherit',
        textDecoration: 'none',
        fontSize: '18px'
    }
}
export default Header;