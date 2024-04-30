import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for styling
import CommerceLogo from './images/commerce-logo.png';

const Navbar = () => {
    return (
        <div className="navbar">
            <img src= {CommerceLogo} alt="Commerce Bank Logo" className="logo" />
            <Link to="/signin" className="primary-button">Login/Sign Up</Link>
            <Link to="/contactus">Contact</Link>
            <Link to="/aboutus">About Us</Link>
            <Link to="/homepage">Home</Link>
        </div>
    );
}

export default Navbar;