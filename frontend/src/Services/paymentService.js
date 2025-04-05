import api from './Api.js';

const paymentService = {
    initiatePayment: async (userId, amount, paymentMethod) => {
        const response = await api.post('/payments/initiate', { userId, amount, paymentMethod });
        return response.data;
    },

    verifyPayment: async (transactionId) => {
        const response = await api.get(`/payments/verify/${transactionId}`);
        return response.data;
    }
};

export default paymentService;
