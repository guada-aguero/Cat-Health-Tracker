import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate, useParams } from 'react-router-dom';

const AddHealthRecord = ({ token }) => {
    const [weight, setWeight] = useState('');
    const [lastVaccination, setLastVaccination] = useState('');
    const [lastAntiparasitic, setLastAntiparasitic] = useState('');
    const [lastVetAppointment, setLastVetAppointment] = useState('');
    const [fleaTickPrevention, setFleaTickPrevention] = useState('');
    const [dewormingTreatment, setDewormingTreatment] = useState('');
    const [medicationRecords, setMedicationRecords] = useState('');
    const [vetVisitDetails, setVetVisitDetails] = useState('');
    const [warningSigns, setWarningSigns] = useState('');
    const [diet, setDiet] = useState('');
    const [exerciseRoutine, setExerciseRoutine] = useState([]);
    const [groomingSchedule, setGroomingSchedule] = useState([]);
    const [teethCleaning, setTeethCleaning] = useState([]);
    const [notes, setNotes] = useState('');
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const navigate = useNavigate();
    const { catId } = useParams();

    useEffect(() => {
        if (!token) {
            alert('Your session has expired. Please log in again.');
        } else {
            const fetchCats = async () => {
                try {
                    const response = await api.get('/cat-profiles/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setCats(response.data);
                    if (catId) {
                        setSelectedCat(catId);
                    }
                } catch (error) {
                    console.error("Failed to fetch cat profiles:", error);
                }
            };

            fetchCats();
        }
    }, [token, catId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCat) {
            alert('Please select a cat profile');
            return;
        }

        const healthRecordData = {
            cat: selectedCat,
            weight,
            last_vaccination: lastVaccination,
            last_antiparasitic: lastAntiparasitic,
            last_vet_appointment: lastVetAppointment,
            flea_tick_prevention: fleaTickPrevention,
            deworming_treatment: dewormingTreatment,
            medication_records: medicationRecords,
            vet_visit_details: vetVisitDetails,
            warning_signs: warningSigns,
            diet,
            exercise_routine: exerciseRoutine.split(',').map(item => item.trim()),
            grooming_schedule: groomingSchedule.split(',').map(item => item.trim()),
            teeth_cleaning: teethCleaning.split(',').map(item => item.trim()),
            notes
        };

        try {
            await api.post('/health-records/', healthRecordData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Health record added successfully');
            navigate('/cat-profile'); // Redirect to cat profile after adding record
        } catch (error) {
            console.error("Failed to add health record:", error);
        }
    };

    return (
        <div>
            <h2>Add Health Record</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Select Cat:</label>
                    <select className="form-control" value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                        <option value="">Select a cat</option>
                        {cats.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Weight:</label>
                    <input type="text" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Vaccination:</label>
                    <input type="date" className="form-control" value={lastVaccination} onChange={(e) => setLastVaccination(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Antiparasitic:</label>
                    <input type="date" className="form-control" value={lastAntiparasitic} onChange={(e) => setLastAntiparasitic(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Vet Appointment:</label>
                    <input type="date" className="form-control" value={lastVetAppointment} onChange={(e) => setLastVetAppointment(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Flea Tick Prevention:</label>
                    <input type="text" className="form-control" value={fleaTickPrevention} onChange={(e) => setFleaTickPrevention(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Deworming Treatment:</label>
                    <input type="text" className="form-control" value={dewormingTreatment} onChange={(e) => setDewormingTreatment(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Medication Records:</label>
                    <input type="text" className="form-control" value={medicationRecords} onChange={(e) => setMedicationRecords(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vet Visit Details:</label>
                    <input type="text" className="form-control" value={vetVisitDetails} onChange={(e) => setVetVisitDetails(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Warning Signs:</label>
                    <input type="text" className="form-control" value={warningSigns} onChange={(e) => setWarningSigns(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Diet:</label>
                    <input type="text" className="form-control" value={diet} onChange={(e) => setDiet(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Exercise Routine (comma separated):</label>
                    <input type="text" className="form-control" value={exerciseRoutine} onChange={(e) => setExerciseRoutine(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Grooming Schedule (comma separated):</label>
                    <input type="text" className="form-control" value={groomingSchedule} onChange={(e) => setGroomingSchedule(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teeth Cleaning (comma separated):</label>
                    <input type="text" className="form-control" value={teethCleaning} onChange={(e) => setTeethCleaning(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Notes:</label>
                    <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-lilac">Add Health Record</button>
            </form>
        </div>
    );
};

export default AddHealthRecord;


