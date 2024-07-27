import React, { useState, useEffect } from 'react';
import api from './api';
import './HairballRecords.css';

const HairballRecords = ({ token }) => {
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [hairballRecords, setHairballRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({
        date: '',
        method: '',
        vomited: false,
    });
    const [editingRecord, setEditingRecord] = useState(null);
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
            const fetchHairballRecords = async () => {
                try {
                    const response = await api.get(`/hairball-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Fetched hairball records:", response.data);
                    setHairballRecords(response.data.sort((a, b) => {
                        if (a.date < b.date) return -1;
                        if (a.date > b.date) return 1;
                        return 0;
                    }));
                } catch (error) {
                    console.error("Error fetching hairball records", error);
                }
            };
            fetchHairballRecords();
        }
    }, [selectedCat, token]);

    useEffect(() => {
        if (editingRecord) {
            setNewRecord({
                date: editingRecord.date || '',
                method: editingRecord.method || '',
                vomited: editingRecord.vomited || false,
            });
            setShowModal(true);
        }
    }, [editingRecord]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setNewRecord({ ...newRecord, [name]: name === "vomited" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = editingRecord
                ? await api.put(`/hairball-records/${editingRecord.id}/`, { ...newRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                : await api.post('/hairball-records/', { ...newRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            console.log("Saved hairball record:", response.data);
            setHairballRecords(editingRecord
                ? hairballRecords.map(record => record.id === editingRecord.id ? response.data : record)
                : [...hairballRecords, response.data].sort((a, b) => {
                    if (a.date < b.date) return -1;
                    if (a.date > b.date) return 1;
                    return 0;
                }));
            setEditingRecord(null);
            setNewRecord({
                date: '',
                method: '',
                vomited: false,
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error saving hairball record", error);
        }
    };

    const selectCat = (cat) => {
        setSelectedCat(cat);
        setHairballRecords([]);
        setEditingRecord(null);
    };

    return (
        <div>
            <h2>Hairball Records</h2>
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
                    <h3>{selectedCat.name}'s Hairball Records</h3>
                    {hairballRecords.length === 0 ? (
                        <p>No hairball records found. Add one!</p>
                    ) : (
                        <ul className="hairball-records-list">
                            {hairballRecords.map(record => (
                                <li key={record.id}>
                                    <strong>Date:</strong> {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'} <br />
                                    <strong>Method:</strong> {record.method || 'N/A'} <br />
                                    <strong>Vomited:</strong> {record.vomited ? 'Yes' : 'No'} <br />
                                    <button onClick={() => { setEditingRecord(record); setShowModal(true); }} className="btn btn-primary">Edit</button>
                                    <button onClick={async () => {
                                        await api.delete(`/hairball-records/${record.id}/`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setHairballRecords(hairballRecords.filter(r => r.id !== record.id));
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
                                <h3>{editingRecord ? 'Edit Hairball Record' : 'Add Hairball Record'}</h3>
                                <form onSubmit={handleSubmit} className="hairball-record-form">
                                    <div className="mb-3">
                                        <label className="form-label">Date:</label>
                                        <input type="date" name="date" className="form-control" value={newRecord.date} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Method:</label>
                                        <input type="text" name="method" className="form-control" value={newRecord.method} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Vomited:</label>
                                        <input type="checkbox" name="vomited" className="form-check-input" checked={newRecord.vomited} onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-lilac">{editingRecord ? 'Update Hairball Record' : 'Add Hairball Record'}</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HairballRecords;
