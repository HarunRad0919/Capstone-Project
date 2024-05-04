import React from 'react';
import AboutBackground from "../Assets/about-background.jpg";
import AboutBackgroundImage from "../Assets/about-background-image.png";
import { BsFillPlayCircleFill } from 'react-icons/bs';

const About = () => {
  return (
    <div className='about-section-container'>
        <div className='about-background-image-container'>
            <img src={AboutBackground} alt="" />
        </div>
        <div className='about-section-image-container'>
            <img src={AboutBackgroundImage} alt="" />
        </div>
        <div className='about-section-text-container'>
            <p className='primary-subheading'> About</p>
            <h1 className='primary-heading'>
                Keeping Track with Commence Bank 
            </h1>
            <p className='primary-text'>
                If you haven't signed up yet, this is the right time. Commence Bank created the new generation of Tracking
                system and you are going to feel so comfortable.
            </p>
            <p className="primary-text">
            Watch a short video about how to track your money with Commence Bank. It is so much easier now! Follow through 
            with your credit cards, buit up your credit score and keep up with cash backs..
            </p>
            <div className='about-buttons-container'>
                <button className='secondary-button'>Learn More</button>
                <button className='watch-video-button'><BsFillPlayCircleFill/>Watch Video</button>
            </div>
        </div>
    </div>
  );
}

export default About;