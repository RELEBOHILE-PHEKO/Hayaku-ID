import api from './Api.js';

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
};

// Add this named export function
export const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await api.get('/auth/verify');
        return response.data.isAuthenticated;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
};

export default authService;