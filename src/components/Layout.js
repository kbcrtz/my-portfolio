import React from "react";
import AboutMe from "./AboutMe";
import Experience from "./Experience";
import Projects from "./Projects";

const Layout = () => {
    return (
        <>
            <div style={styles.container}>
                <div style={styles.leftColumn}>
                    <AboutMe />
                </div>
                <div style={styles.rightColumn}>
                    <Experience />
                </div>
            </div>
            <Projects />
        </>
    );
};

const styles = {
    container: {
        display: "flex", // Enable flexbox
        flexWrap: "wrap", // Allow wrapping for smaller screens
        alignItems: "flex-start", // Align headers to the top
        justifyContent: "space-between", // Space out columns
        maxWidth: "1200px", // Max width for the layout
        width: "100%",
        margin: "0 auto", // Center container horizontally
        gap: "40px", // Space between the two sections
    },
    leftColumn: {
        flex: "1 1 45%", // Allow columns to take 45% width and shrink if needed
        minWidth: "300px", // Ensure columns don't shrink too much
        order: 1, // Display first on mobile
        display: "flex",
        flexDirection: "column",
        gap: "20px", // Space between AboutMe and Experience
    },
    rightColumn: {
        flex: "1 1 45%", // Allow columns to take 45% width and shrink if needed
        minWidth: "300px", // Ensure columns don't shrink too much
        order: 2, // Display second on mobile (after left column)
    },
};

export default Layout;