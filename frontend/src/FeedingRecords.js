import React, { useEffect, useState } from 'react';
import api from './api';
import { useParams } from 'react-router-dom';
import './FeedingRecords.css';

const FeedingRecords = ({ token }) => {
    const { catId } = useParams();
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [feedingRecords, setFeedingRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        date: '',
        time: '',
        portion_size: '',
        food_brand: '',
        food_type: 'wet',
        feeding_schedule: 'routine'
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
            const fetchFeedingRecords = async () => {
                try {
                    const response = await api.get(`/feeding-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("Fetched feeding records:", response.data);
                    setFeedingRecords(response.data.sort((a, b) => {
                        if (a.date < b.date) return -1;
                        if (a.date > b.date) return 1;
                        if (a.time && b.time) {
                            if (a.time < b.time) return -1;
                            if (a.time > b.time) return 1;
                        }
                        return 0;
                    }));
                } catch (error) {
                    console.error("Error fetching feeding records", error);
                }
            };
            fetchFeedingRecords();
        }
    }, [selectedCat, token]);

    useEffect(() => {
        if (editingRecord) {
            setNewRecord({
                date: editingRecord.date || '',
                time: editingRecord.time || '',
                portion_size: editingRecord.portion_size || '',
                food_brand: editingRecord.food_brand || '',
                food_type: editingRecord.food_type || 'wet',
                feeding_schedule: editingRecord.feeding_schedule || 'routine'
            });
            setShowModal(true);
        }
    }, [editingRecord]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = editingRecord 
                ? await api.put(`/feeding-records/${editingRecord.id}/`, { ...newRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                : await api.post('/feeding-records/', { ...newRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            console.log("Saved feeding record:", response.data);
            setFeedingRecords(editingRecord 
                ? feedingRecords.map(record => record.id === editingRecord.id ? response.data : record)
                : [...feedingRecords, response.data].sort((a, b) => {
                    if (a.date < b.date) return -1;
                    if (a.date > b.date) return 1;
                    if (a.time && b.time) {
                        if (a.time < b.time) return -1;
                        if (a.time > b.time) return 1;
                    }
                    return 0;
                }));
            setEditingRecord(null);
            setNewRecord({
                date: '',
                time: '',
                portion_size: '',
                food_brand: '',
                food_type: 'wet',
                feeding_schedule: 'routine'
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error saving feeding record", error);
        }
    };

    const selectCat = (cat) => {
        setSelectedCat(cat);
        setFeedingRecords([]);
        setEditingRecord(null);
    };

    return (
        <div>
            <h2>Feeding Records</h2>
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
                    <h3 className="shaded-background">{selectedCat.name}'s Feeding Records</h3>
                    {feedingRecords.length === 0 ? (
                        <p>No feeding records found. Add one!</p>
                    ) : (
                        <ul className="feeding-records-list">
                            {feedingRecords.map(record => (
                                <li key={record.id}>
                                    <strong>Date:</strong> {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'} <br />
                                    <strong>Time:</strong> {record.time || 'N/A'} <br />
                                    <strong>Portion Size:</strong> {record.portion_size ? `${record.portion_size} grams` : 'N/A'} <br />
                                    <strong>Food Brand:</strong> {record.food_brand || 'N/A'} <br />
                                    <strong>Food Type:</strong> {record.food_type || 'N/A'} <br />
                                    <strong>Feeding Schedule:</strong> {record.feeding_schedule || 'N/A'} <br />
                                    <button onClick={() => { setEditingRecord(record); setShowModal(true); }} className="btn btn-primary">Edit</button>
                                    <button onClick={async () => {
                                        await api.delete(`/feeding-records/${record.id}/`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setFeedingRecords(feedingRecords.filter(r => r.id !== record.id));
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
                                <h3>{editingRecord ? 'Edit Feeding Record' : 'Add Feeding Record'}</h3>
                                <form onSubmit={handleSubmit} className="feeding-record-form">
                                    <div className="mb-3">
                                        <label className="form-label">Date:</label>
                                        <input type="date" name="date" className="form-control" value={newRecord.date} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Time:</label>
                                        <input type="time" name="time" className="form-control" value={newRecord.time} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Portion Size (grams):</label>
                                        <input type="number" name="portion_size" className="form-control" value={newRecord.portion_size} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Food Brand:</label>
                                        <input type="text" name="food_brand" className="form-control" value={newRecord.food_brand} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Food Type:</label>
                                        <select name="food_type" className="form-control" value={newRecord.food_type} onChange={handleChange}>
                                            <option value="wet">Wet</option>
                                            <option value="dry">Dry</option>
                                            <option value="homemade">Homemade</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Feeding Schedule:</label>
                                        <select name="feeding_schedule" className="form-control" value={newRecord.feeding_schedule} onChange={handleChange}>
                                            <option value="routine">Routine Feeding</option>
                                            <option value="free">Free Feeding</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-lilac">{editingRecord ? 'Update Feeding Record' : 'Add Feeding Record'}</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FeedingRecords;



