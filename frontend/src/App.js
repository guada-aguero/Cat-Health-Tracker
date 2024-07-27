import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import HealthRecords from './HealthRecords';
import CatProfile from './CatProfile';
import AddCatProfile from './AddCatProfile';
import HealthTrends from './HealthTrends';
import Home from './Home';
import CatCalendar from './CatCalendar';
import FeedingRecords from './FeedingRecords';
import InteractionRecords from './InteractionRecords';
import HairballRecords from './HairballRecords';
import Recommendations from './Recommendations';
import Resources from './Resources';  // Import the Resources component
import api from './api';  // Import your API utility
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (token) {
                try {
                    const response = await api.get('/recommendations/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUnreadCount(response.data.length);
                } catch (error) {
                    console.error("Failed to fetch recommendations:", error);
                }
            }
        };

        fetchRecommendations();
    }, [token]);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">Cat Health Tracker</Link>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cat-profile">Cat Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/health-records">Health Records</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/calendar">Calendar</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/health-trends">Health Trends</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/feeding-records">Feeding Records</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/interaction-records">Interaction Records</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/hairball-records">Hairball Records</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/recommendations">
                                        Recommendations {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/resources">Resources</Link>  {/* Add link to Resources */}
                                </li>
                                {token ? (
                                    <li className="nav-item">
                                        <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/register">Register</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/login" element={token ? <Navigate to="/" /> : <Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/health-records" element={token ? <HealthRecords token={token} /> : <Navigate to="/login" />} />
                    <Route path="/cat-profile" element={token ? <CatProfile token={token} /> : <Navigate to="/login" />} />
                    <Route path="/add-cat-profile" element={token ? <AddCatProfile token={token} /> : <Navigate to="/login" />} />
                    <Route path="/calendar" element={token ? <CatCalendar token={token} /> : <Navigate to="/login" />} />
                    <Route path="/health-trends" element={token ? <HealthTrends token={token} /> : <Navigate to="/login" />} />
                    <Route path="/feeding-records" element={token ? <FeedingRecords token={token} /> : <Navigate to="/login" />} />
                    <Route path="/interaction-records" element={token ? <InteractionRecords token={token} /> : <Navigate to="/login" />} />
                    <Route path="/hairball-records" element={token ? <HairballRecords token={token} /> : <Navigate to="/login" />} />
                    <Route path="/recommendations" element={token ? <Recommendations token={token} setUnreadCount={setUnreadCount} /> : <Navigate to="/login" />} />
                    <Route path="/resources" element={<Resources />} />  {/* Add route for Resources */}
                    <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

