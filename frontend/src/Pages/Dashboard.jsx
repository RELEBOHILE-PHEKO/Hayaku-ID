import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <section className="dashboard">
            <h2>Your Profile</h2>
            <p>Welcome back! Manage your profile and check application status.</p>
            <div className="dashboard-menu">
                <Link to="/profile">Edit Profile</Link>
                <Link to="/application-form">Fill Application</Link>
                <Link to="/application-status">Application Status</Link>
                <Link to="/payment">Payment</Link>
            </div>
        </section>
    );
}

export default Dashboard;
