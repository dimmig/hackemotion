import React from 'react';
import axios from "axios"
import logo from "../assets/logo.png"
import Reveal from "../Reveal";

function Navbar(props) {
    return (
        <div className="navbar">
            <img src={logo} alt="logo" className="logo"/>
            <div className="sections">
                <Reveal animationDuration={.4} delay={.2}>
                <a className="header-href"  href="#">Home</a>
                </Reveal>
                <Reveal animationDuration={.4} delay={.3}>
                <a className="header-href"  href="#">About</a>
                </Reveal>
                <Reveal animationDuration={.4} delay={.4}>
                <a className="header-href"  href="#">Products</a>
                </Reveal>
                <Reveal animationDuration={.4} delay={.5}>
                <a  className="header-href" href="#">Contacts</a>
                </Reveal>
                <Reveal animationDuration={.4} delay={.6}>
                <button className="faq-btn">FAQ</button>
                </Reveal>
            </div>
        </div>
    );
}

export default Navbar;