import api from './api.js';

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

export default authService;
