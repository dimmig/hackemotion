import React from 'react';
import axios from "axios"
import logo from "../assets/logo.png"

function Navbar(props) {
    return (
        <div className="navbar">
            <img src={logo} alt="logo" className="logo"/>
            <div className="sections">
                <a className="header-href"  href="#">Home</a>
                <a className="header-href"  href="#">About</a>
                <a className="header-href"  href="#">Products</a>
                <a  className="header-href" href="#">Contacts</a>
                <button className="faq-btn">FAQ</button>
            </div>
        </div>
    );
}

export default Navbar;