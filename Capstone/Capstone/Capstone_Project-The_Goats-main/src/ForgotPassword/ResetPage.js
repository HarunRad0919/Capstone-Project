// SignInPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResetPage.css';
import { auth,googleProvider } from "../firebase";
import {fetchSignInMethodsForEmail, sendEmailVerification,sendPasswordResetEmail,sendSignInLinkToEmail} from "firebase/auth";

const ResetPage = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegularLogin = (event) => {
        event.preventDefault();
    };

    const PasswordReset= () =>{
        try{
            sendPasswordResetEmail(auth, email)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                setErrorMessage('Email Has Dosnt Exist');
                return;
            })
            .catch((error) => {
                setErrorMessage('Email Has Been Sent!');
            });
        }catch(err){
            console.error(err);
        }
        
    }

    return (
        <div>
            <div className="content-container">
                <h1>Password Reset</h1>
                <form onSubmit={handleRegularLogin}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <button onClick={PasswordReset}>Send Email</button>
                </form>
            </div>
            {errorMessage && (
                <div className="error-box">
                    <p className="error-message">{errorMessage}</p>
                </div>
            )}
        </div>
    );
}

export default ResetPage;