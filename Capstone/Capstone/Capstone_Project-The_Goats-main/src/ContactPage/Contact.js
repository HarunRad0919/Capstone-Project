// ContactUsPage.js
import React, { useState } from 'react';
import './Contact.css'; // Import the CSS file for styling

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form submission

        // Dummy validation - Check if all fields are filled
        if (!name || !email || !message) {
            setErrorMessage('All fields are required. Please fill them out.');
            return;
        }

        // Dummy validation - Check if email is valid (you can use a regex or a library like validator.js for more accurate validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        // If all validations pass, you can proceed with sending the message
        console.log('Message sent:', { name, email, message });
    };

    return (
        <div>
            <div className="content-container">
                <h1>Contact Us</h1>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Message:</label>
                    <textarea
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button type="submit">Send Message</button>
                </form>
            </div>
            {errorMessage && (
                <div className="error-box">
                    <p className="error-message">{errorMessage}</p>
                </div>
            )}
        </div>
    );
};

export default Contact;