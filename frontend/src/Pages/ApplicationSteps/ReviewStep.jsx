import React, { useState } from 'react';
import axios from 'axios';

function ReviewStep({ formData, onBack }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            // Replace with your actual API endpoint
            const response = await axios.post('http://localhost:5003/api/submit-application', formData);
            console.log('Response:', response.data);
            alert('ApplicationSteps Submitted Successfully!');
        } catch (err) {
            console.error('Error submitting application:', err);
            setError('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-step">
            <h2>Review Your Information</h2>
            <div>
                <strong>Full Name:</strong> {formData.fullName} <br />
                <strong>Date of Birth:</strong> {formData.dob} <br />
                <strong>Gender:</strong> {formData.gender} <br />
            </div>

            {error && <p className="error">{error}</p>}
            <button onClick={onBack}>Back</button>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    );
}

export default ReviewStep;