import React, { useState } from 'react';
import api from './api';

const AddCatProfile = ({ token }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [microchipNumber, setMicrochipNumber] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('age', age);
        formData.append('breed', breed);
        formData.append('microchip_number', microchipNumber);
        formData.append('photo', photo);

        try {
            const response = await api.post('/cat-profiles/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Cat profile added:', response.data);
        } catch (error) {
            console.error('Error adding cat profile:', error.response || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Name:</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Gender:</label>
                <input type="text" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Age:</label>
                <input type="number" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Breed:</label>
                <input type="text" className="form-control" value={breed} onChange={(e) => setBreed(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Microchip Number:</label>
                <input type="text" className="form-control" value={microchipNumber} onChange={(e) => setMicrochipNumber(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Photo:</label>
                <input type="file" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
            </div>
            <button type="submit" className="btn btn-lilac">Add Cat Profile</button>
        </form>
    );
};

export default AddCatProfile;


