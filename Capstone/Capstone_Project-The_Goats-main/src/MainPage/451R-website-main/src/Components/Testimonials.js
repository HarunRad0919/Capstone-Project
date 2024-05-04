import React from 'react';
import ProfilePic from "../Assets/john-doe-image.png";
import {AiFillStar} from 'react-icons/ai';


const Testimonials = () => {
  return (
    <div className='work-section-wrapper'>
         
        <div className='work-section-top'>
            <p className='primary-subheading'>Testimonials </p>
            <h1 className='primary-heading'> What They Are Saying</h1>
            <p className='primary-text'>
                We care about what you think. 
            </p>
            </div>
            <div className='testimonial-section-bottom'>
                <img src={ProfilePic} alt=''/>
                <p>
                    I heard about Commence before but I was too scared to change my banking company. After I gave Commence
                    bank a chance, I am so relaxed about it. It has never been this easy before!
                </p>
                <div className='testimonials-stars-container'>
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                </div>
                <h2>Alex Richards</h2>
            </div>
        </div>

  );
}

export default Testimonials;