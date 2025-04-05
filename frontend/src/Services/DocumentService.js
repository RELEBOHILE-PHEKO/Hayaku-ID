import api from './api.js';

const documentService = {
    uploadDocument: async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    verifyDocument: async (documentId) => {
        const response = await api.get(`/documents/verify/${documentId}`);
        return response.data;
    }
};

export default documentService;
