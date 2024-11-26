import React from "react";

const Contact = () =>{
    return(
        <section id='contact'styles={styles.section} >
            <h4 style={styles.text}>Contact Me</h4>
            <a href='https://youtu.be/dQw4w9WgXcQ?si=1w-61R8u3GUqTkxV' ><button>click me</button></a>
            <div>
                <p>    </p>
            </div>
        </section>
    );
};
const styles ={
    text: {
        fontFamily: "'Fira Code', monospace",
    }
}

export default Contact;