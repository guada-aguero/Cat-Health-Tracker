import './CatProfile.css';
import React, { useState, useEffect } from 'react';
import api from './api';

const CatProfile = ({ token }) => {
    const [catProfiles, setCatProfiles] = useState([]);
    const [selectedCatProfile, setSelectedCatProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        breed: '',
        microchip_number: '',
        photo: null,
    });

    const fetchCatProfiles = async () => {
        try {
            const response = await api.get('/cat-profiles/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCatProfiles(response.data);
            if (response.data.length > 0) {
                setSelectedCatProfile(response.data[0]); // Select the first cat profile by default
            }
        } catch (error) {
            console.error("Failed to fetch cat profiles:", error);
        }
    };

    useEffect(() => {
        fetchCatProfiles();
    }, [token]);

    useEffect(() => {
        if (selectedCatProfile) {
            setFormData({
                name: selectedCatProfile.name || '',
                gender: selectedCatProfile.gender || '',
                age: selectedCatProfile.age || '',
                breed: selectedCatProfile.breed || '',
                microchip_number: selectedCatProfile.microchip_number || '',
                photo: null,
            });
        } else {
            setFormData({
                name: '',
                gender: '',
                age: '',
                breed: '',
                microchip_number: '',
                photo: null,
            });
        }
    }, [selectedCatProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('breed', formData.breed);
        formDataToSend.append('microchip_number', formData.microchip_number);
        if (formData.photo) {
            formDataToSend.append('photo', formData.photo);
        }

        try {
            if (isCreating) {
                await api.post('/cat-profiles/', formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setIsCreating(false);
            } else if (selectedCatProfile) {
                await api.put(`/cat-profiles/${selectedCatProfile.id}/`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            fetchCatProfiles();
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save cat profile:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/cat-profiles/${selectedCatProfile.id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedCatProfile(null);
            fetchCatProfiles();
        } catch (error) {
            console.error("Failed to delete cat profile:", error);
        }
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setIsEditing(true);
        setFormData({
            name: '',
            gender: '',
            age: '',
            breed: '',
            microchip_number: '',
            photo: null,
        });
    };

    return (
        <div>
            <h2>Cat Profile</h2>
            {catProfiles.length > 0 && (
                <div>
                    <label>Select a Cat Profile:</label>
                    <select onChange={(e) => setSelectedCatProfile(catProfiles.find(profile => profile.id === parseInt(e.target.value)))}>
                        {catProfiles.map(profile => (
                            <option key={profile.id} value={profile.id}>
                                {profile.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {selectedCatProfile && !isEditing && (
                <div className="cat-profile">
                    {selectedCatProfile.photo && <img src={selectedCatProfile.photo} alt={selectedCatProfile.name} className="cat-photo" />}
                    <div className="cat-details">
                        <p><strong>Name:</strong> {selectedCatProfile.name}</p>
                        <p><strong>Gender:</strong> {selectedCatProfile.gender}</p>
                        <p><strong>Age:</strong> {selectedCatProfile.age}</p>
                        <p><strong>Breed:</strong> {selectedCatProfile.breed}</p>
                        <p><strong>Microchip Number:</strong> {selectedCatProfile.microchip_number}</p>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
            {isEditing && (
                <form onSubmit={handleSaveChanges}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Gender:</label>
                        <input type="text" name="gender" value={formData.gender} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Age:</label>
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Breed:</label>
                        <input type="text" name="breed" value={formData.breed} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Microchip Number:</label>
                        <input type="text" name="microchip_number" value={formData.microchip_number} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Photo:</label>
                        <input type="file" name="photo" onChange={handleFileChange} />
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
            {!isEditing && (
                <button onClick={handleCreateNew}>Create New Cat Profile</button>
            )}
        </div>
    );
};

export default CatProfile;

















