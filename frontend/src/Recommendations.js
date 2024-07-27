import React, { useEffect, useState } from 'react';
import api from './api';
import './Recommendations.css';

const Recommendations = ({ token, setUnreadCount }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get('/recommendations/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecommendations(response.data);
                setUnreadCount(response.data.length); // Update unread count
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [token, setUnreadCount]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/recommendations/${id}/status/`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendations(recommendations.filter(rec => rec.id !== id));
            setUnreadCount(prevCount => prevCount - 1);
        } catch (error) {
            console.error("Failed to update recommendation status:", error);
        }
    };

    return (
        <div>
            <h2>Recommendations</h2>
            {recommendations.length === 0 ? (
                <p>No recommendations available.</p>
            ) : (
                <ul className="recommendations-list">
                    {recommendations.map(rec => (
                        <li key={rec.id}>
                            {rec.message}
                            <div className="buttons">
                                <button onClick={() => handleStatusUpdate(rec.id, 'done')} className="btn btn-success">Done</button>
                                <button onClick={() => handleStatusUpdate(rec.id, 'not_applicable')} className="btn btn-secondary">Not Applicable</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Recommendations;