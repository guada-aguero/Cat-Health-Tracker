import './styles.css';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from './api';

const CatCalendar = ({ token }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Fetch events when the component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedEvents = response.data.map(event => ({
                ...event,
                id: event.id.toString()
            }));
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    const handleDateClick = (info) => {
        setSelectedEvent({ title: '', start: info.dateStr, end: info.dateStr, location: '', notes: '', allDay: false });
        setIsPopupOpen(true);
    };

    const handleEventClick = (info) => {
        console.log("Clicked event ID:", info.event.id);
        const event = events.find(e => e.id === info.event.id);
        if (event) {
            setSelectedEvent(event);
            setIsPopupOpen(true);
        } else {
            console.error("Event not found:", info.event.id);
        }
    };

    const handlePopupClose = () => {
        setSelectedEvent(null);
        setIsPopupOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSelectedEvent({ ...selectedEvent, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEvent) {
            console.error("No event selected");
            return;
        }

        try {
            console.log("Submitting event:", selectedEvent);
            if (selectedEvent.id) {
                await api.put(`/events/${selectedEvent.id}/`, selectedEvent, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(events.map(event => (event.id === selectedEvent.id ? selectedEvent : event)));
            } else {
                const response = await api.post('/events/', selectedEvent, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents([...events, { ...response.data, id: response.data.id.toString() }]);
            }
            fetchEvents();
            handlePopupClose();
        } catch (error) {
            console.error("Error saving event", error);
        }
    };

    const handleEventDelete = async () => {
        if (!selectedEvent || !selectedEvent.id) {
            console.error("No event selected or event ID missing");
            return;
        }

        try {
            await api.delete(`/events/${selectedEvent.id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
            handlePopupClose();
        } catch (error) {
            console.error("Error deleting event", error);
        }
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
            />
            {isPopupOpen && selectedEvent && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>{selectedEvent.id ? 'Edit Event' : 'Add Event'}</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title:</label>
                                <input type="text" name="title" className="form-control" value={selectedEvent.title || ''} onChange={handleInputChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Start:</label>
                                <input type="datetime-local" name="start" className="form-control" value={selectedEvent.start || ''} onChange={handleInputChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">End:</label>
                                <input type="datetime-local" name="end" className="form-control" value={selectedEvent.end || ''} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">All Day:</label>
                                <input type="checkbox" name="allDay" className="form-check-input" checked={selectedEvent.allDay || false} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Location:</label>
                                <input type="text" name="location" className="form-control" value={selectedEvent.location || ''} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Notes:</label>
                                <textarea name="notes" className="form-control" value={selectedEvent.notes || ''} onChange={handleInputChange}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">{selectedEvent.id ? 'Update Event' : 'Add Event'}</button>
                            {selectedEvent.id && <button type="button" className="btn btn-danger" onClick={handleEventDelete}>Delete</button>}
                            <button type="button" className="btn btn-secondary" onClick={handlePopupClose}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatCalendar;


