import React, { useState } from "react";
import authService from "../../Services/authService";

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        maxUsers: 1000,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleToggleMaintenance = async () => {
        const confirmToggle = window.confirm("Are you sure you want to toggle maintenance mode?");
        if (confirmToggle) {
            setSettings((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
            // Optionally, save the change to the backend here
        }
    };

    const handleMaxUsersChange = (e) => {
        const value = Math.max(1, e.target.value); // Ensure max users is at least 1
        setSettings((prev) => ({ ...prev, maxUsers: value }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await authService.saveSettings(settings); // Replace with your API call
            alert("Settings saved successfully!");
        } catch (err) {
            setError("Failed to save settings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>System Settings</h1>
            <label>
                Maintenance Mode:
                <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={handleToggleMaintenance}
                />
            </label>
            <div>
                <label>
                    Max Users:
                    <input
                        type="number"
                        value={settings.maxUsers}
                        onChange={handleMaxUsersChange}
                        min="1"
                    />
                </label>
            </div>
            <button onClick={handleSaveSettings} disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default SystemSettings;