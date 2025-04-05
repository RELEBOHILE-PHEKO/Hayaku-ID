// src/Services/authService.js
import api from './Api.js';

// 🔥 Named export
export const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists
};

// 👇 Default export object
const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        return localStorage.getItem('token');
    },
    saveSettings(settings) {

    }
};

export default authService;
