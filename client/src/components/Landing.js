import React from 'react';
import "../styles/landing.css"
import Reveal from "../Reveal";
import Navbar from "./Navbar";
import Header from "./Header";


function Landing(props) {
    return (
        <div className="app">
            
        <Reveal animationDuration={.6}>
            <Navbar />
        </Reveal>

        <Reveal animationDuration={.6} delay={.3}>
            <Header />
        </Reveal>
        </div>
);
}

export default Landing;