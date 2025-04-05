import React, { useState } from 'react';

const SupportTicket = () => {
    const [formData, setFormData] = useState({ name: '', email: '', issue: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.issue || !formData.message) {
            alert("Please fill in all fields before submitting.");
            return;
        }
        console.log("Support ticket submitted:", formData);
        setSubmitted(true);
    };

    return (
        <section className="support-ticket">
            <h2>Submit a Support Ticket</h2>
            {submitted ? (
                <p>✅ Your request has been submitted. We will contact you soon.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </label>

                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>

                    <label>
                        Issue Type:
                        <select name="issue" value={formData.issue} onChange={handleChange} required>
                            <option value="">Select an issue</option>
                            <option value="Application Issue">Application Issue</option>
                            <option value="Technical Problem">Technical Problem</option>
                            <option value="General Inquiry">General Inquiry</option>
                        </select>
                    </label>

                    <label>
                        Message:
                        <textarea name="message" value={formData.message} onChange={handleChange} required />
                    </label>

                    <button type="submit">Submit Ticket</button>
                </form>
            )}
        </section>
    );
};

export default SupportTicket;
