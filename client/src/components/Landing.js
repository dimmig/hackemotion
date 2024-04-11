import React from 'react';
import "../styles/landing.css"
import img from "../assets/bg.png"


function Landing(props) {
    return (
        <div className="app">
            <nav className="navbar">
                <div className="header">
                    <div className="nav-section">
                        <a href="#">Home</a>
                        <a href="#">About</a>
                        <div className="header-section">
                            <h1 className="header-text">Emo</h1>
                            <h1 className="header-text light">tune</h1>
                        </div>
                        <a href="#">Services</a>
                        <a href="#">Contacts</a>
                        <div className="nav-links">
                        </div>
                    </div>
                </div>
            </nav>
        </div>
);
}

export default Landing;