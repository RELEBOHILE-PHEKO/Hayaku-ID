import api from './api.js';

const applicationService = {
    submitApplication: async (applicationData) => {
        const response = await api.post('/applications/submit', applicationData);
        return response.data;
    },

    getApplicationStatus: async (applicationId) => {
        const response = await api.get(`/applications/status/${applicationId}`);
        return response.data;
    }
};

export default applicationService;
