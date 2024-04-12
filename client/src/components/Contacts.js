import React from 'react';
import Navbar from './Navbar';
import "../styles/other_pages.css"
import {useNavigate} from "react-router-dom";
import Reveal from '../Reveal';

function Contacts(props) {
    return (
        <div className = "page">
            <Reveal animationDuration={.6}>
                <Navbar />
            </Reveal>
            <Reveal animationDuration={.6} delay={.3}>
                <div className = "body">
                    <h1>Contact with us!</h1>
                    <p>adskiy.drochila2010@gmail.com</p>
                </div>
            </Reveal>
        </div>
    );
}
export default Contacts;