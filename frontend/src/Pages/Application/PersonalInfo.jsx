import React, { useState } from 'react';
import axios from 'axios';

const PersonalInfo = ({ formData, setFormData, nextStep }) => {
    const [error, setError] = useState({
        fullName: "",
        dob: "",
        gender: "",
        form: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: "" }); // Clear specific error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newError = { fullName: "", dob: "", gender: "" };

        // Validate input fields
        if (!formData.fullName) {
            newError.fullName = "Full Name is required.";
        }
        if (!formData.dob) {
            newError.dob = "Date of Birth is required.";
        }
        if (!formData.gender) {
            newError.gender = "Gender is required.";
        }

        // Check for any validation errors
        if (newError.fullName || newError.dob || newError.gender) {
            setError(newError);
            return;
        }

        try {
            // API call to send data to the backend
            const response = await axios.post('http://localhost:5003/api/personal-info', formData);
            console.log('Response:', response.data);
            nextStep(); // Proceed to the next step if successful
        } catch (err) {
            console.error('Error submitting form:', err);
            setError({ ...error, form: "Failed to submit data. Please try again." });
        }
    };

    return (
        <section className="personal-info">
            <h2>Step 1: Personal Information</h2>
            <p>Please enter your basic personal details.</p>

            <form onSubmit={handleSubmit}>
                {error.form && <p className="error">{error.form}</p>}
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    {error.fullName && <p className="error">{error.fullName}</p>}
                </div>

                <div>
                    <label htmlFor="dob">Date of Birth:</label>
                    <input
                        type="date"
                        name="dob"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                    {error.dob && <p className="error">{error.dob}</p>}
                </div>

                <div>
                    <label htmlFor="gender">Gender:</label>
                    <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {error.gender && <p className="error">{error.gender}</p>}
                </div>

                <button type="submit">Next</button>
            </form>
        </section>
    );
};

export default PersonalInfo;