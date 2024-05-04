// SignInPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignInPage.css';
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Using useNavigate hook

    const handleRegularLogin = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            setErrorMessage('All fields are required. Please fill them out.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // If login successful, navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error.message);
        }
    }
    
    const signInWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            // If login successful, navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <div className="content-container">
                <h1>Login</h1>
                <form onSubmit={handleRegularLogin}>
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

                    <button type="submit">Login</button> {/* Changed onClick to type="submit" */}
                </form>
                <div className="google-login-container">
                    <button onClick={signInWithGoogle}>Login with Google</button>
                </div>
                <div className="register-link">
                    <Link to="/register">Don't have an account? Register here</Link>
                </div>
                <div className="resetpassword-link">
                    <Link to="/resetpassword">Forgot Password?</Link>
                </div>
            </div>
            {errorMessage && 
                <div className="error-message">{errorMessage}</div>
            }
        </div>
    );
}

export default SignInPage;