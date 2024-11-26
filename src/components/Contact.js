import React from "react";

function composeEmail(){
    const email = 'kobecortez31@gmail.com';
    const subject = 'Hello Kobe';
    const body = 'I would like to connect with you.';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const Contact = () =>{
    return(
        <section id='contact'styles={styles.section} >
            <h4 style={styles.text}>Contact Me</h4>
            <button onClick={composeEmail}>click me</button>
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