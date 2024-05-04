import React from 'react';
import Equity from "../Assets/csr-human-rights-icon.png";
import Pace from "../Assets/choose-image.png";
import Inclusion from "../Assets/cdi_seal23_fullcolor-awards.png";


const Work = () => {
    const workInfoData = [
        {
            image:Equity,
            title:"Equality",
            text: "We’ve worked thoughtfully to establish a variety of programs and initiatives designed to embrace an inclusive and diverse culture.",
        },
        {
            image:Pace,
            title:"Fast Pace",
            text: "It is a great enviorenment for freshly graduated student, where they can learn and keep up with the technology in the fastest pace.",
        },
        {
            image:Inclusion,
            title:"Inclusion",
            text: "Everyone is welcome to work with Commence, we love to grow by learning from each perspective. With this case, we know what are the needs for everyone",
        },



    ]
  return <div className='work-section-wrapper'>
    <div className='work-section-top'>
        <p className='primary-subheading'>Awards</p>
        <h1 className="primary-heading">Highlights</h1>
        <p className='primary-text'>
            Even though our company is new, we already caought all the eyes. As well as Commence has an amazing software system
            we also have great culture within our work place.
        </p>
        </div>
        <div className='work-section-bottom'>
            {
                workInfoData.map((data) => (
                    <div className='work-section-info'>
                        <div className='info-boxes-img-container'>
                            <img src={data.image} alt="" />
                        </div>
                        <h2>{data.title}</h2>
                        <p>{data.text}</p>
                    </div>
            ))}
        </div>
        
        </div>
  
}

export default Work