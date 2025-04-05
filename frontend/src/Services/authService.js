import api from './Api.js';

// Token management constants
const TOKEN_KEY = 'hayakuid_auth_token';

const authService = {
    /**
     * Authenticates user credentials
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>} User data
     * @throws {Error} On authentication failure
     */
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (!response.data.token) {
                throw new Error('No token received');
            }

            authService.storeToken(response.data.token);
            return response.data;

        } catch (error) {
            authService.clearToken();
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    /**
     * Clears authentication data
     */
    logout: () => {
        authService.clearToken();
    },

    /**
     * Gets stored token
     * @returns {string|null} JWT token
     */
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Securely stores authentication token
     * @param {string} token
     */
    storeToken: (token) => {
        localStorage.setItem(TOKEN_KEY, token);
        // Set token in API client headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    /**
     * Clears authentication token
     */
    clearToken: () => {
        localStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common['Authorization'];
    }
};

/**
 * Verifies if user is authenticated
 * @returns {Promise<boolean>} Authentication status
 */
export const checkAuthStatus = async () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
        const response = await api.get('/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // If token is invalid, clear it
        if (!response.data.isAuthenticated) {
            authService.clearToken();
            return false;
        }

        return true;

    } catch (error) {
        authService.clearToken();
        return false;
    }
};

export default authService;