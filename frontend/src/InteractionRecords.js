import React, { useEffect, useState } from 'react';
import api from './api';
import './InteractionRecords.css';

const InteractionRecords = ({ token }) => {
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [interactionRecords, setInteractionRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        date: '',
        played: false,
        sleep_quality: '',
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const response = await api.get('/cat-profiles/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCats(response.data);
            } catch (error) {
                console.error("Failed to fetch cat profiles:", error);
            }
        };

        fetchCats();
    }, [token]);

    useEffect(() => {
        if (selectedCat) {
            const fetchInteractionRecords = async () => {
                try {
                    const response = await api.get(`/interaction-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setInteractionRecords(response.data);
                } catch (error) {
                    console.error("Error fetching interaction records", error);
                }
            };
            fetchInteractionRecords();
        }
    }, [selectedCat, token]);

    useEffect(() => {
        if (editingRecord) {
            setNewRecord({
                date: editingRecord.date || '',
                played: editingRecord.played || false,
                sleep_quality: editingRecord.sleep_quality || '',
            });
            setShowModal(true);
        }
    }, [editingRecord]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRecord({ ...newRecord, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = editingRecord 
                ? await api.put(`/interaction-records/${editingRecord.id}/`, { ...newRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                : await api.post('/interaction-records/', { ...newRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            setInteractionRecords(editingRecord 
                ? interactionRecords.map(record => record.id === editingRecord.id ? response.data : record)
                : [...interactionRecords, response.data]);
            setEditingRecord(null);
            setNewRecord({
                date: '',
                played: false,
                sleep_quality: '',
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error saving interaction record", error);
        }
    };

    const selectCat = (cat) => {
        setSelectedCat(cat);
        setInteractionRecords([]);
        setEditingRecord(null);
    };

    return (
        <div>
            <h2>Interaction Records</h2>
            <div className="cat-selection">
                <h3>Select a Cat</h3>
                <div className="cat-list">
                    {cats.map(cat => (
                        <div key={cat.id} className="cat-item" onClick={() => selectCat(cat)}>
                            <img src={cat.photo} alt={cat.name} className="cat-photo" />
                            <p className="cat-name">{cat.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCat && (
                <>
                    <h3>{selectedCat.name}'s Interaction Records</h3>
                    {interactionRecords.length === 0 ? (
                        <p>No interaction records found. Add one!</p>
                    ) : (
                        <ul className="interaction-records-list">
                            {interactionRecords.map(record => (
                                <li key={record.id}>
                                    <strong>Date:</strong> {record.date} <br />
                                    <strong>Played:</strong> {record.played ? 'Yes' : 'No'} <br />
                                    <strong>Sleep Quality:</strong> {record.sleep_quality} <br />
                                    <button onClick={() => { setEditingRecord(record); setShowModal(true); }} className="btn btn-primary">Edit</button>
                                    <button onClick={async () => {
                                        await api.delete(`/interaction-records/${record.id}/`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setInteractionRecords(interactionRecords.filter(r => r.id !== record.id));
                                    }} className="btn btn-danger">Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Modal */}
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                                <h3>{editingRecord ? 'Edit Interaction Record' : 'Add Interaction Record'}</h3>
                                <form onSubmit={handleSubmit} className="interaction-record-form">
                                    <div className="mb-3">
                                        <label className="form-label">Date:</label>
                                        <input type="date" name="date" className="form-control" value={newRecord.date} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Played:</label>
                                        <input type="checkbox" name="played" className="form-check-input" checked={newRecord.played} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Sleep Quality (1-10):</label>
                                        <input type="number" name="sleep_quality" className="form-control" min="1" max="10" value={newRecord.sleep_quality} onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-lilac">{editingRecord ? 'Update Interaction Record' : 'Add Interaction Record'}</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InteractionRecords;