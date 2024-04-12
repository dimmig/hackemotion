import React from 'react';
import Navbar from './Navbar';
import "../styles/other_pages.css"
import Reveal from '../Reveal';

function Products(props) {
    return (
        <div className = "page">
            <Reveal animationDuration={.6}>
                <Navbar />
            </Reveal>
            <Reveal animationDuration={.6} delay={.3}>
                <div className = "body">
                    <h1>Emotune is just the beginning</h1>
                    <p>Our future holds a collection of innovative apps dedicated to enhancing emotional well-being.
                         Stay tuned for more empowering releases.</p>
                </div>
            </Reveal>
        </div>
    );
}
export default Products;