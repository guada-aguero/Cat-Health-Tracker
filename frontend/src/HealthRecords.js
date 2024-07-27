import React, { useEffect, useState } from 'react';
import api from './api';
import { useParams } from 'react-router-dom';
import './HealthRecords.css';

const HealthRecords = ({ token }) => {
    const { catId } = useParams();
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [healthRecords, setHealthRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        weight: '',
        last_vaccination: '',
        last_antiparasitic: '',
        last_vet_appointment: '',
        flea_tick_prevention: '',
        deworming_treatment: '',
        medication_records: '',
        vet_visit_details: '',
        warning_signs: '',
        diet: '',
        exercise_routine: [],
        grooming_schedule: [],
        teeth_cleaning: [],
        hairball_prevention: [],
        notes: ''
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
            const fetchHealthRecords = async () => {
                try {
                    const response = await api.get(`/health-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHealthRecords(response.data);
                } catch (error) {
                    console.error("Error fetching health records", error);
                }
            };
            fetchHealthRecords();
        }
    }, [selectedCat, token]);

    useEffect(() => {
        if (editingRecord) {
            setNewRecord({
                weight: editingRecord.weight || '',
                last_vaccination: editingRecord.last_vaccination || '',
                last_antiparasitic: editingRecord.last_antiparasitic || '',
                last_vet_appointment: editingRecord.last_vet_appointment || '',
                flea_tick_prevention: editingRecord.flea_tick_prevention || '',
                deworming_treatment: editingRecord.deworming_treatment || '',
                medication_records: editingRecord.medication_records || '',
                vet_visit_details: editingRecord.vet_visit_details || '',
                warning_signs: editingRecord.warning_signs || '',
                diet: editingRecord.diet || '',
                exercise_routine: Array.isArray(editingRecord.exercise_routine) ? editingRecord.exercise_routine : [],
                grooming_schedule: Array.isArray(editingRecord.grooming_schedule) ? editingRecord.grooming_schedule : [],
                teeth_cleaning: Array.isArray(editingRecord.teeth_cleaning) ? editingRecord.teeth_cleaning : [],
                hairball_prevention: Array.isArray(editingRecord.hairball_prevention) ? editingRecord.hairball_prevention : [],
                notes: editingRecord.notes || ''
            });
        }
    }, [editingRecord]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (['exercise_routine', 'grooming_schedule', 'teeth_cleaning', 'hairball_prevention'].includes(name)) {
            setNewRecord({
                ...newRecord,
                [name]: checked ? [...newRecord[name], value] : newRecord[name].filter(day => day !== value)
            });
        } else {
            setNewRecord({ ...newRecord, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Filter out empty date fields
        const filteredRecord = { ...newRecord };
        Object.keys(filteredRecord).forEach(key => {
            if (['last_vaccination', 'last_antiparasitic', 'last_vet_appointment', 'flea_tick_prevention', 'deworming_treatment'].includes(key) && !filteredRecord[key]) {
                delete filteredRecord[key];
            }
        });

        try {
            const response = editingRecord 
                ? await api.put(`/health-records/${editingRecord.id}/`, { ...filteredRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                : await api.post('/health-records/', { ...filteredRecord, cat: selectedCat.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            setHealthRecords(editingRecord 
                ? healthRecords.map(record => record.id === editingRecord.id ? response.data : record)
                : [...healthRecords, response.data]);
            setEditingRecord(null);
            setNewRecord({
                weight: '',
                last_vaccination: '',
                last_antiparasitic: '',
                last_vet_appointment: '',
                flea_tick_prevention: '',
                deworming_treatment: '',
                medication_records: '',
                vet_visit_details: '',
                warning_signs: '',
                diet: '',
                exercise_routine: [],
                grooming_schedule: [],
                teeth_cleaning: [],
                hairball_prevention: [],
                notes: ''
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error saving health record", error);
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const selectCat = (cat) => {
        setSelectedCat(cat);
        setHealthRecords([]);  // Clear previous health records
        setEditingRecord(null);  // Clear any ongoing edits
    };

    return (
        <div>
            <h2>Health Records</h2>
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
                    <h3 className="shaded-background">{selectedCat.name}'s Health Records</h3>
                    {healthRecords.length === 0 ? (
                        <p>No health records found. Add one!</p>
                    ) : (
                        <ul className="health-records-list">
                            {healthRecords.map(record => (
                                <li key={record.id}>
                                    <strong>Weight:</strong> {record.weight} <br />
                                    <strong>Last Vaccination:</strong> {record.last_vaccination} <br />
                                    <strong>Last Antiparasitic:</strong> {record.last_antiparasitic} <br />
                                    <strong>Last Vet Appointment:</strong> {record.last_vet_appointment} <br />
                                    <strong>Flea Tick Prevention:</strong> {record.flea_tick_prevention} <br />
                                    <strong>Deworming Treatment:</strong> {record.deworming_treatment} <br />
                                    <strong>Medication Records:</strong> {record.medication_records} <br />
                                    <strong>Vet Visit Details:</strong> {record.vet_visit_details} <br />
                                    <strong>Warning Signs:</strong> {record.warning_signs} <br />
                                    <strong>Diet:</strong> {record.diet} <br />
                                    <strong>Exercise Routine:</strong> {Array.isArray(record.exercise_routine) ? record.exercise_routine.join(', ') : ''} <br />
                                    <strong>Grooming Schedule:</strong> {Array.isArray(record.grooming_schedule) ? record.grooming_schedule.join(', ') : ''} <br />
                                    <strong>Teeth Cleaning:</strong> {Array.isArray(record.teeth_cleaning) ? record.teeth_cleaning.join(', ') : ''} <br />
                                    <strong>Hairball Prevention:</strong> {Array.isArray(record.hairball_prevention) ? record.hairball_prevention.join(', ') : ''} <br />
                                    <strong>Notes:</strong> {record.notes} <br />
                                    <button onClick={() => { setEditingRecord(record); setShowModal(true); }} className="btn btn-primary">Edit</button>
                                    <button onClick={async () => {
                                        await api.delete(`/health-records/${record.id}/`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setHealthRecords(healthRecords.filter(r => r.id !== record.id));
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
                                <h3>{editingRecord ? 'Edit Health Record' : 'Add Health Record'}</h3>
                                <form onSubmit={handleSubmit} className="health-record-form">
                                    <div className="mb-3">
                                        <label className="form-label">Weight:</label>
                                        <input type="number" name="weight" className="form-control" value={newRecord.weight} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Vaccination:</label>
                                        <input type="date" name="last_vaccination" className="form-control" value={newRecord.last_vaccination} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Antiparasitic:</label>
                                        <input type="date" name="last_antiparasitic" className="form-control" value={newRecord.last_antiparasitic} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Vet Appointment:</label>
                                        <input type="date" name="last_vet_appointment" className="form-control" value={newRecord.last_vet_appointment} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Flea Tick Prevention:</label>
                                        <input type="date" name="flea_tick_prevention" className="form-control" value={newRecord.flea_tick_prevention} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Deworming Treatment:</label>
                                        <input type="date" name="deworming_treatment" className="form-control" value={newRecord.deworming_treatment} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Medication Records:</label>
                                        <textarea name="medication_records" className="form-control" value={newRecord.medication_records} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Vet Visit Details:</label>
                                        <textarea name="vet_visit_details" className="form-control" value={newRecord.vet_visit_details} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Warning Signs:</label>
                                        <textarea name="warning_signs" className="form-control" value={newRecord.warning_signs} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Diet:</label>
                                        <textarea name="diet" className="form-control" value={newRecord.diet} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Exercise Routine:</label>
                                        <div className="d-flex flex-wrap">
                                            {daysOfWeek.map(day => (
                                                <div key={day} className="form-check me-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="exercise_routine"
                                                        value={day}
                                                        checked={newRecord.exercise_routine.includes(day)}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">{day}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Grooming Schedule:</label>
                                        <div className="d-flex flex-wrap">
                                            {daysOfWeek.map(day => (
                                                <div key={day} className="form-check me-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="grooming_schedule"
                                                        value={day}
                                                        checked={newRecord.grooming_schedule.includes(day)}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">{day}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Teeth Cleaning:</label>
                                        <div className="d-flex flex-wrap">
                                            {daysOfWeek.map(day => (
                                                <div key={day} className="form-check me-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="teeth_cleaning"
                                                        value={day}
                                                        checked={newRecord.teeth_cleaning.includes(day)}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">{day}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hairball Prevention:</label>
                                        <div className="d-flex flex-wrap">
                                            {daysOfWeek.map(day => (
                                                <div key={day} className="form-check me-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="hairball_prevention"
                                                        value={day}
                                                        checked={newRecord.hairball_prevention.includes(day)}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">{day}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Notes:</label>
                                        <textarea name="notes" className="form-control" value={newRecord.notes} onChange={handleChange}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-lilac">{editingRecord ? 'Update Health Record' : 'Add Health Record'}</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HealthRecords;