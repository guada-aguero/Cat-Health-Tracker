import React, { useEffect, useState } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Chart from 'chart.js/auto';
import api from './api';
import './HealthTrends.css';

const HealthTrends = ({ token }) => {
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [healthData, setHealthData] = useState({
        weight: [],
        sleepQuality: [],
        hairballPrevention: []
    });

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
            const fetchHealthData = async () => {
                try {
                    const healthResponse = await api.get(`/health-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const interactionResponse = await api.get(`/interaction-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const hairballResponse = await api.get(`/hairball-records/?cat=${selectedCat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const weightData = healthResponse.data.map(record => ({
                        x: record.timestamp,
                        y: record.weight
                    }));

                    const sleepQualityData = interactionResponse.data.map(record => ({
                        x: record.date,
                        y: record.sleep_quality
                    }));

                    const hairballPreventionData = hairballResponse.data.map(record => ({
                        x: record.date,
                        y: 1  // Any value to indicate the event
                    }));

                    setHealthData({
                        weight: weightData,
                        sleepQuality: sleepQualityData,
                        hairballPrevention: hairballPreventionData
                    });
                } catch (error) {
                    console.error("Error fetching health data", error);
                }
            };
            fetchHealthData();
        }
    }, [selectedCat, token]);

    const selectCat = (cat) => {
        setSelectedCat(cat);
        setHealthData({
            weight: [],
            sleepQuality: [],
            hairballPrevention: []
        });
    };

    const lineChartData = {
        datasets: [
            {
                label: 'Weight',
                data: healthData.weight,
                borderColor: 'teal',
                fill: false,
                yAxisID: 'y'
            },
            {
                label: 'Sleep Quality',
                data: healthData.sleepQuality,
                borderColor: 'purple',
                fill: false,
                yAxisID: 'y1'
            }
        ]
    };

    const scatterChartData = {
        datasets: [
            {
                label: 'Hairball Prevention',
                data: healthData.hairballPrevention,
                backgroundColor: 'blue',
                pointRadius: 7
            }
        ]
    };

    const lineChartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Weight (kg)'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Sleep Quality'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    };

    const scatterChartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                display: false  // Hide the Y-axis since we're only interested in the dates
            }
        }
    };

    return (
        <div>
            <h2>Health Trends</h2>
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
                    <div className="chart-container">
                        <h3>{selectedCat.name}'s Health Trends</h3>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                    <div className="chart-container">
                        <h3>{selectedCat.name}'s Hairball Prevention</h3>
                        <Scatter data={scatterChartData} options={scatterChartOptions} />
                    </div>
                </>
            )}
        </div>
    );
};

export default HealthTrends;


