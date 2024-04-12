import React from 'react';
import "../styles/landing.css"
import Navbar from "./Navbar";
import Header from "./Header";


function Landing(props) {
    sessionStorage.removeItem("user")
    return (
        <div className="app">
            
            <Navbar />

            <Header />
        </div>
);
}

export default Landing;