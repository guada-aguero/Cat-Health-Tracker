// api.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Fixed import statement

const api = axios.create({
    baseURL: 'http://localhost:8000/api',  // Ensure this points to the correct base URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
                    if (res.status === 200) {
                        localStorage.setItem('token', res.data.access);
                        api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access;
                        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access;
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Refresh token is invalid or expired', refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
};

// Example functions for the new models

export const fetchFeedingRecords = async (catId) => {
    return api.get(`/feeding-records/?cat=${catId}`);
};

export const createFeedingRecord = async (data) => {
    return api.post('/feeding-records/', data);
};

export const fetchInteractionRecords = async (catId) => {
    return api.get(`/interaction-records/?cat=${catId}`);
};

export const createInteractionRecord = async (data) => {
    return api.post('/interaction-records/', data);
};

export const fetchHairballRecords = async (catId) => {
    return api.get(`/hairball-records/?cat=${catId}`);
};

export const createHairballRecord = async (data) => {
    return api.post('/hairball-records/', data);
};

export default api;