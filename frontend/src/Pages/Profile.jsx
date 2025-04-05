import React, { useState } from 'react';

function Profile() {
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+123456789'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateEmail(userData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!userData.phone) {
            setError("Please enter your phone number.");
            return;
        }

        setLoading(true);

        try {
            // Simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log("Profile updated:", userData);
            setSuccess("Profile updated successfully!");
        } catch (err) {
            console.error('Error updating profile:', err);
            setError("There was an error updating your profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="profile-page">
            <h2>Your Profile</h2>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleUpdateProfile}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        required
                    />
                </label>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </section>
    );
}

export default Profile;