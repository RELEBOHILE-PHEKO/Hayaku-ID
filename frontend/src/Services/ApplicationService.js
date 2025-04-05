import api from './Api.js';

export const submitApplication = async (applicationData) => {
    const response = await api.post('/applications/submit', applicationData);
    return response.data;
};

export const getApplicationStatus = async (applicationId) => {
    const response = await api.get(`/applications/status/${applicationId}`);
    return response.data;
};

export const saveApplicationData = async (data) => {
    const response = await api.post('/applications/save', data);
    return response.data;
};

// You can also keep the default export if needed
export default {
    submitApplication,
    getApplicationStatus,
    saveApplicationData
};