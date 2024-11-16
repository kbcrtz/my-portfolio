import React from 'react';

const Header = () => {
    return(
        <header style={styles.header}>
            <h1 style={styles.title}>Kobe Cortez</h1>
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
        backgroundColor: '#333',
        color: '#fff'
    },
    title: {
        fontSize: '18px',
    },
    nav: {
        display: 'flex',
        gap: '15px',
    },
    link:{
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px'
    }
}
export default Header;