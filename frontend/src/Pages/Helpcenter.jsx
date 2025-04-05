import React from 'react';
import { useHistory } from 'react-router-dom'; // Importing useHistory from react-router-dom

const Helpcenter = () => {
    const history = useHistory(); // Hook to access the history instance

    return (
        <section className="help-center">
            <h2>Welcome to the HayakuID Help Center</h2>
            <p>Find answers to your questions, troubleshoot issues, or contact our support team.</p>

            <div className="help-options">
                <div className="help-box">
                    <h3>📖 User Guide</h3>
                    <p>Learn how to apply for your passport or ID step-by-step.</p>
                    <button onClick={() => history.push('/user-guide')}>Read Guide</button>
                </div>

                <div className="help-box">
                    <h3>❓ FAQs</h3>
                    <p>Find answers to the most frequently asked questions.</p>
                    <button onClick={() => history.push('/faqs')}>View FAQs</button>
                </div>

                <div className="help-box">
                    <h3>📩 Contact Support</h3>
                    <p>Need help? Submit a support ticket, and we’ll assist you.</p>
                    <button onClick={() => history.push('/support')}>Get Help</button>
                </div>
            </div>
        </section>
    );
};

export default Helpcenter;