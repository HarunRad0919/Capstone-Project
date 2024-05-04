import React from 'react';
import Logo from '../Assets/Logo.jpg';
import { BsTwitter } from 'react-icons/bs';
import {SiLinkedin} from 'react-icons/si';
import { BsYoutube} from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';


const Footer = () => {
  return (
    
    <div className='footer-wrapper'>
        <div className='footer-logo-container'>
            <img src={Logo} alt='' className='footer-logo'/>
        </div>
        <div className='footer-icons'>
            <BsTwitter/>
            <SiLinkedin/>
            <BsYoutube/>
            <FaFacebookF/>
        </div>
    <div className='footer-section-two'>
        <div className='footer-section-columns'>
            <span>Quality</span>
            <span>Help</span>
            <span>Share</span>
            <span>Careers</span>
            <span>Testimonials</span>
            <span>Work</span>
        </div>
        <div className='footer-section-columns'>
            <span>784-747-84-22</span>
            <span>harun@umsyste.edu</span>
            <span>rivan@umsystem.edu</span>
            <span>ismail@umsystem.edu</span>
        </div>
        <div className='footer-section-colmns'>
            <span>Terms &Condititons</span>
            <span>Privacy & Policy</span>
        </div>

    </div>
    </div>
  )
}

export default Footer;