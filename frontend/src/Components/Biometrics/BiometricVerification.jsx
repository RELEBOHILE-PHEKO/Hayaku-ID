import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FacialRecognition from './FacialRecognition.jsx';
import FingerprintCapture from './FingerprintCapture.jsx';

const BiometricVerification = ({
                                   applicantId,
                                   requiredBiometrics = ['face', 'fingerprint'],
                                   onComplete,
                                   onError
                               }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [biometricData, setBiometricData] = useState({});
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verifying, success, failed
    const [errorDetails, setErrorDetails] = useState(null);

    const biometricOptions = [
        { id: 'face', label: 'Facial Recognition', component: FacialRecognition },
        { id: 'fingerprint', label: 'Fingerprint Capture', component: FingerprintCapture },
    ];

    // Filter only required biometrics
    const steps = biometricOptions.filter(option =>
        requiredBiometrics.includes(option.id)
    );

    const handleBiometricCapture = async (type, data) => {
        // Store the biometric data
        setBiometricData(prev => ({
            ...prev,
            [type]: data
        }));

        // Move to next step or complete verification
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await verifyBiometrics(); // Await the verification process
        }
    };

    const verifyBiometrics = async () => {
        try {
            setVerificationStatus('verifying');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock verification result (success 80% of the time)
            const isSuccessful = Math.random() > 0.2;

            if (isSuccessful) {
                setVerificationStatus('success');
                onComplete && onComplete({
                    applicantId,
                    biometricData,
                    verified: true,
                    timestamp: new Date().toISOString()
                });
            } else {
                setVerificationStatus('failed');
                setErrorDetails('Biometric verification failed. Please try again.');
                onError && onError(new Error('Biometric verification failed. Please try again.'));
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('failed');
            setErrorDetails(error.message || 'Unknown verification error');
            onError && onError(error);
        }
    };

    const resetVerification = () => {
        setBiometricData({});
        setCurrentStep(0);
        setVerificationStatus('pending');
        setErrorDetails(null);
    };

    const CurrentBiometricComponent = steps[currentStep]?.component;

    return (
        <div className="biometric-verification-container p-4 border rounded">
            <h2>Biometric Verification</h2>

            {/* Progress indicator */}
            {verificationStatus === 'pending' && steps.length > 1 && (
                <div className="verification-progress">
                    <div className="steps-indicator d-flex justify-content-between">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`step text-center ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                                <div className="step-number">{index + 1}</div>
                                <div className="step-label">{step.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Current biometric component */}
            {verificationStatus === 'pending' && CurrentBiometricComponent && (
                <div className="biometric-component-wrapper">
                    <CurrentBiometricComponent
                        onCapture={(data) => handleBiometricCapture(steps[currentStep].id, data)}
                        onError={(error) => {
                            setErrorDetails(error.message || 'Capture failed');
                            onError && onError(error);
                        }}
                    />
                </div>
            )}

            {/* Verification in progress */}
            {verificationStatus === 'verifying' && (
                <div className="verification-progress text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Verifying...</span>
                    </div>
                    <p>Verifying your biometric data...</p>
                    <p className="sub-text">This may take a few moments</p>
                </div>
            )}

            {/* Verification success */}
            {verificationStatus === 'success' && (
                <div className="alert alert-success text-center">
                    <div className="success-icon">✓</div>
                    <h3>Verification Successful</h3>
                    <p>Your biometric data has been successfully verified.</p>
                </div>
            )}

            {/* Verification failed */}
            {verificationStatus === 'failed' && (
                <div className="alert alert-danger text-center">
                    <div className="error-icon">✗</div>
                    <h3>Verification Failed</h3>
                    <p>{errorDetails || 'An error occurred during verification.'}</p>
                    <button onClick={resetVerification} className="btn btn-warning">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

BiometricVerification.propTypes = {
    applicantId: PropTypes.string.isRequired,
    requiredBiometrics: PropTypes.arrayOf(PropTypes.string),
    onComplete: PropTypes.func.isRequired,
    onError: PropTypes.func,
};

export default BiometricVerification;