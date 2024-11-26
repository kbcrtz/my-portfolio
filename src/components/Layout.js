import React from "react";
import AboutMe from "./AboutMe";
import Projects from "./Projects";

const Layout = () => {
    return (
        <div style={styles.container}>
            <div style={styles.column}>
                <AboutMe />
            </div>
            <div style={styles.column}>
                <Projects />
            </div>
        </div>
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
    column: {
        flex: "1 1 45%", // Allow columns to take 45% width and shrink if needed
        minWidth: "300px", // Ensure columns don’t shrink too much
    },
};

export default Layout;