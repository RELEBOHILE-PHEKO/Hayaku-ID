import React from 'react';
import { useNavigate } from 'react-router-dom';

const Helpcenter = () => {
    const navigate = useNavigate(); // Replaces useHistory in v6

    return (
        <section className="help-center">
            <h2>Welcome to the HayakuID Help Center</h2>
            <p>Find answers to your questions, troubleshoot issues, or contact our support team.</p>

            <div className="help-options">
                <div className="help-box">
                    <h3>📖 User Guide</h3>
                    <p>Learn how to apply for your passport or ID step-by-step.</p>
                    <button onClick={() => navigate('/user-guide')}>Read Guide</button>
                </div>

                <div className="help-box">
                    <h3>❓ FAQs</h3>
                    <p>Find answers to the most frequently asked questions.</p>
                    <button onClick={() => navigate('/faqs')}>View FAQs</button>
                </div>

                <div className="help-box">
                    <h3>📩 Contact Support</h3>
                    <p>Need help? Submit a support ticket, and we'll assist you.</p>
                    <button onClick={() => navigate('/support')}>Get Help</button>
                </div>
            </div>
        </section>
    );
};

export default Helpcenter;