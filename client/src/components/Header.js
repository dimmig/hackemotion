import React from 'react';
import img from "../assets/face.png"

function Header(props) {
    return (
        <div className="header">
            <div className="header-wrapper">
            <div className="header-section">
                <p className="header-text">Unlock <br />The Power Of <br /> Emotune </p>
            </div>
            <p className="header-desc">Emotune is a revolutionary platform that empowers individuals to gain deeper
                insights into the emotional states of others, fostering enhanced interpersonal connections and </p>
                <button className="expore-btn">Expolore emotune</button>
            </div>
            <img src={img} className="header-img"/>
        </div>
    );
}

export default Header;