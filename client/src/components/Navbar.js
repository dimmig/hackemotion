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
                <button className="faq-btn" onClick={async () => {
                    try {
                        const res = await axios.get("http://localhost:3001/data");
                        console.log(res);
                        // Do something with res.data here, e.g., set state
                    } catch (error) {
                        console.error("There was an error fetching the FAQ data:", error);
                        // Handle the error here, e.g., set an error state, show notification
                    }
                }}>FAQ</button>
            </div>
        </div>
    );
}

export default Navbar;