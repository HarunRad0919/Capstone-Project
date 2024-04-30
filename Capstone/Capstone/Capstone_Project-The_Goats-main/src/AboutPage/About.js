// About.js
import React from 'react';
import './About.css'; 
import pinkStocksImage from './pinkstocks.jpg'; // Import the image

const About = () => {
    return (
        <div>
            <h1>About Us</h1>
            <div className="about-content">
                <div className="text-container">
                    <p>
                        <strong>Here are some key points about our company:</strong>
                    </p>
                    <ul className="key-points">
                        <li className="hoverable">We strive for excellence in everything we do.</li>
                        <li className="hoverable">Customer satisfaction is our top priority.</li>
                        <li className="hoverable">We believe in innovation and continuous improvement.</li>
                        <li className="hoverable">Our team is dedicated to delivering high-quality products/services.</li>
                    </ul>
                    
                </div>
            </div>
            <div className="image-container">
                <img src={pinkStocksImage} alt="Pink Stocks" className="about-image" />
            </div>
            <div className="contact-info">
                <p>If you have any questions or would like to learn more about us, feel free to <a href="/contactus">contact us</a>.</p>
            </div>
        </div>
    );
}

export default About;