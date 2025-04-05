import api from './Api.js';

const biometricService = {
    submitBiometricData: async (dob, gender, fingerprintData) => {
        if (!dob || !gender || !fingerprintData) {
            throw new Error('Missing required biometric data');
        }

        const response = await api.post('/biometrics/submit', { dob, gender, fingerprintData });
        return response.data;
    },

    verifyBiometric: async (userId) => {
        const response = await api.get(`/biometrics/verify/${userId}`);
        return response.data;
    }
};

export default biometricService;
