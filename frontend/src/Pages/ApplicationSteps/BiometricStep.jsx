import React, { useState } from 'react';

const BiometricStep = ({ onPrevious }) => {
    const [biometricData, setBiometricData] = useState(null);

    const handleCapture = () => {
        // Placeholder for biometric data capture logic
        setBiometricData('Sample Biometric Data');
    };

    return (
        <div>
            <h2>Biometric Verification</h2>
            <button onClick={handleCapture}>Capture Biometric Data</button>
            {biometricData && <p>Biometric Data Captured</p>}
            <button onClick={onPrevious}>Back</button>
            <button disabled={!biometricData}>Submit</button>
        </div>
    );
};

export default BiometricStep;
