// Register.js
import React, { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Ensure this import is present

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register/', { username, password });
            alert('Registration successful! Please log in.');
            navigate('/login'); // Redirect to login after successful registration
        } catch (error) {
            alert('Registration failed, please try again.');
        }
    };

    return (
        <div className="centered-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
