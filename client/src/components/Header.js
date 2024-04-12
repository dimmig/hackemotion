import React from 'react';
import img from "../assets/face.png"
import {useNavigate} from "react-router-dom";
import Reveal from "../Reveal";


function Header(props) {
    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/login'); // Use the path you want to redirect to
    };
    return (
            <div className="header">
                <div className="header-wrapper">
                <div className="header-section">
                    <Reveal animationDuration={.4} >
                    <p className="header-text">Unlock</p>
                    </Reveal>
                    <Reveal animationDuration={.4} delay={.3}>
                        <p className="header-text"> The Power Of</p>
                    </Reveal>
                    <Reveal animationDuration={.4} delay={.4}>
                            <p className="header-text">Emotune </p>
                    </Reveal>
                </div>
                    <Reveal animationDuration={.4} delay={.5}>
                    <p className="header-desc">Emotune is a revolutionary platform that empowers individuals to gain deeper insights into the emotional states of others, fostering enhanced interpersonal connections and empathy.</p>
                    </Reveal>
                    <Reveal animationDuration={.4} delay={.6}>
                    <button className="expore-btn" onClick={handleExploreClick}>Explore emotune</button>
                    </Reveal>
                </div>
                <Reveal animationDuration={.4} delay={.3}>
                <img src={img} className="header-img"/>
                </Reveal>
            </div>
    )
}

export default Header;