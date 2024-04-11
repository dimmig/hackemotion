import React from 'react';
import img from "../assets/face.png"
import {useNavigate} from "react-router-dom";

function Header(props) {
    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/login'); // Use the path you want to redirect to
    };
    return (
        <div className="header">
            <div className="header-wrapper">
            <div className="header-section">
                <p className="header-text">Unlock</p>
                <p className="header-text">The Power </p>
                <p className="header-text">Of Emotune </p>
            </div>
            <p className="header-desc">Emotune is a revolutionary platform that empowers individuals to gain deeper
                insights into the emotional states of others, fostering enhanced interpersonal connections and </p>
                <button className="expore-btn" onClick={handleExploreClick}>Expolore emotune</button>
            </div>
            <img src={img} className="header-img"/>
        </div>
    );
}

export default Header;