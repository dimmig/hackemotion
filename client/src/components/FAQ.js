import React from 'react';
import {useNavigate} from "react-router-dom";
import "../styles/other_pages.css"
import Navbar from './Navbar';
import Reveal from '../Reveal';

function FAQ(props) {
    return (
        <div className = "page">
            <Reveal animationDuration={.6}>
                <Navbar />
            </Reveal>
            <Reveal animationDuration={.6} delay={.3}>
                <div className = "body">
                    <div className = "info-box">
                        <h1 className='info-quest'>How does Emotune work?</h1>
                        <p className='info-text'>Emotune helps you understand emotions better with quizzes. 
                            You see pictures of different feelings and pick which one you think it is. 
                            Then, Emotune gives you tips to improve how you understand emotions based on your picks. 
                            It's like a fun way to get better at understanding emotions!</p>
                    </div>
                    <div className = "info-box">
                        <h1 className='info-quest'>How do I troubleshoot common issues?</h1>
                        <p className='info-text'>Just contact with us!</p>
                    </div>
                    <div className = "info-box">
                        <h1 className='info-quest'>What are the pricing plans?</h1>
                        <p className='info-text'>Emotune is absolutely free to use!</p>
                    </div>
                    <div className = "info-box">
                        <h1 className='info-quest'>What are your terms of service?</h1>
                        <div className='info-text'>
                            <h2>Age Requirements:</h2>
                            <p>Our platform welcomes users of all ages, though we advise caution for individuals with heart conditions, as certain images may be unsettling.</p>
                            
                            <h2>Data Usage Consent:</h2>
                            <p>By signing up for our service, you grant us permission to utilize your Name, Age, and gender for scientific research and promotional purposes.</p>
                            
                            <h2>Continuous Service Enhancement:</h2>
                            <p>We rely on your feedback to develop, enhance, and update Emotune services, ensuring continuous improvement for our users' benefit.</p>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    );
}
export default FAQ;