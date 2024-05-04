// RegisterPage.js
import { auth,googleProvider } from "../firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import React, { useState } from 'react';
import './RegisterPage.css'; // Import the CSS file for styling

const RegisterPage = () => {
    const [email, setEmail] = useState(""); //sets email
    const [password, setPassword] = useState(""); //sets password
    const [confirmPassword, setConfirmPassword] = useState('');//confirms password
    const [errorMessage, setErrorMessage] = useState('');//sent message if not true
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    //allows to sign up with email and password
    const Register = async () => {
    try {
        if (!email || !password || !confirmPassword) {
            setErrorMessage('All fields are required. Please fill them out.');
            return;
        }
        // Dummy validation - Check if password and confirm password match
        else if (password !== confirmPassword) {
            setErrorMessage('Password and Confirm Password must match.');
            return;
        }
        //check password for requirments
        else if (!passwordRegex.test(password)) {
            setErrorMessage('Password does not meet the requirements.');
            return;
        }
        else{
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                setErrorMessage('Thank you for registering with use!');
                return;
            })
            .catch((error) => {
                setErrorMessage('Email Already Exists!');
            });
        }
    } catch (err) {
        console.error(err);
    }
    };

    const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password || !confirmPassword) {
        setErrorMessage('All fields are required. Please fill them out.');
        return;
    }
    // Dummy validation - Check if password and confirm password match
    if (password !== confirmPassword) {
        setErrorMessage('Password and Confirm Password must match.');
        return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        setErrorMessage('Password does not meet the requirements.');
        return;
    }
    // If all validations pass, you can proceed with registration
    console.log('Registration successful');
    };

    return (
        <div>
            <div className="content-container">
                <h1>Register</h1>
                <div className="password-requirements">
                    <h3>Password Requirements:</h3>
                    <ul>
                        <li>An uppercase character</li>
                        <li>A minimum of 8 characters</li>
                        <li>An alphabetic character</li>
                        <li>A special character</li>
                        <li>A lowercase character</li>
                        <li>A numeric character</li>
                    </ul>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button onClick={Register}>Register</button>
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

export default RegisterPage;