import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        setLoading(true); // Start loading state

        if (!formData.emailOrPhone || !formData.password) {
            setError('Please enter both email/phone and password!');
            setLoading(false); // End loading state
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                emailOrPhone: formData.emailOrPhone,
                password: formData.password
            });

            console.log(response.data);
            // Redirect to the dashboard or home page
            navigate('/dashboard'); // Use navigate for redirection
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <section className="login-form">
            <h2>Login to HayakuID</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="emailOrPhone">Email or Phone</label>
                    <input
                        id="emailOrPhone"
                        type="text"
                        placeholder="Email or Phone"
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <Link to="/register" className="link">Don't have an account? Sign up</Link>
        </section>
    );
}

export default Login;