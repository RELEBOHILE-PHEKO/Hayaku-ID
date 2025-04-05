import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FingerprintCapture = ({ onCapture, onError, fingerCount = 10 }) => {
    const [status, setStatus] = useState('idle'); // idle, initializing, capturing, success, error
    const [activeFinger, setActiveFinger] = useState(null);
    const [capturedFingers, setCapturedFingers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [deviceStatus, setDeviceStatus] = useState('disconnected'); // disconnected, connected

    // Finger labels for display
    const fingerLabels = [
        'Right Thumb', 'Right Index', 'Right Middle', 'Right Ring', 'Right Little',
        'Left Thumb', 'Left Index', 'Left Middle', 'Left Ring', 'Left Little'
    ].slice(0, fingerCount);

    // Simulate device connection
    useEffect(() => {
        const connectDevice = async () => {
            try {
                setStatus('initializing');
                // Simulate connecting to a fingerprint device
                await new Promise(resolve => setTimeout(resolve, 1500));
                setDeviceStatus('connected');
                setStatus('idle');
            } catch (err) {
                console.error('Error connecting to fingerprint device:', err);
                setDeviceStatus('disconnected');
                setStatus('error');
                setErrorMessage('Failed to connect to fingerprint scanner');
                onError && onError(err);
            }
        };

        connectDevice();

        return () => {
            // Cleanup: disconnect from device on unmount
            setDeviceStatus('disconnected');
        };
    }, [onError]);

    const startCapture = (fingerIndex) => {
        if (deviceStatus !== 'connected') {
            setErrorMessage('Device not connected. Please try again.');
            setStatus('error');
            return;
        }

        setActiveFinger(fingerIndex);
        setStatus('capturing');

        // Simulate fingerprint capture process
        setTimeout(() => {
            try {
                // Mock successful capture (90% success rate)
                if (Math.random() > 0.1) {
                    const fingerprintData = {
                        fingerIndex,
                        fingerName: fingerLabels[fingerIndex],
                        timestamp: new Date().toISOString(),
                        quality: 0.7 + Math.random() * 0.3, // Random quality between 0.7 and 1.0
                        data: `fingerprint-data-${fingerIndex}-${Date.now()}`,
                    };

                    setCapturedFingers(prev => [...prev, fingerprintData]);

                    // Check if all required fingers have been captured
                    if (capturedFingers.length + 1 >= fingerCount) {
                        setStatus('success');
                        onCapture(capturedFingers.concat(fingerprintData));
                    } else {
                        setStatus('idle');
                    }
                } else {
                    // Simulate occasional failure
                    throw new Error('Low quality scan detected');
                }
            } catch (err) {
                console.error('Fingerprint capture failed:', err);
                setStatus('error');
                setErrorMessage(err.message || 'Failed to capture fingerprint');
                onError && onError(err);
            }

            setActiveFinger(null);
        }, 2000);
    };

    const retryCapture = () => {
        setStatus('idle');
        setErrorMessage('');
    };

    const resetCapture = () => {
        setCapturedFingers([]);
        setStatus('idle');
        setErrorMessage('');
    };

    return (
        <div className="fingerprint-capture-container">
            <h3>Fingerprint Capture</h3>

            {deviceStatus === 'disconnected' && status === 'initializing' && (
                <div className="connecting-device">
                    <div className="spinner"></div>
                    <p>Connecting to fingerprint scanner...</p>
                </div>
            )}

            {deviceStatus === 'connected' && (
                <>
                    <div className="device-status connected">
                        <span className="status-indicator"></span>
                        <span>Scanner Connected</span>
                    </div>

                    <div className="fingers-grid">
                        {fingerLabels.map((fingerName, index) => {
                            const isCaptured = capturedFingers.some(f => f.fingerIndex === index);
                            const isActive = activeFinger === index;

                            return (
                                <div
                                    key={index}
                                    className={`finger-item ${isCaptured ? 'captured' : ''} ${isActive ? 'active' : ''}`}
                                    onClick={() => !isCaptured && !isActive && status === 'idle' && startCapture(index)}
                                >
                                    <div className="finger-icon">
                                        {isCaptured ? '✓' : index + 1}
                                    </div>
                                    <div className="finger-name">{fingerName}</div>
                                </div>
                            );
                        })}
                    </div>

                    {status === 'capturing' && (
                        <div className="capture-progress">
                            <div className="spinner"></div>
                            <p>Place {fingerLabels[activeFinger]} on the scanner</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <p>All fingerprints captured successfully!</p>
                        </div>
                    )}

                    <div className="capture-actions">
                        {status === 'idle' && capturedFingers.length > 0 && (
                            <div className="progress-indicator">
                                <span>{capturedFingers.length} of {fingerCount} fingerprints captured</span>
                            </div>
                        )}

                        {capturedFingers.length > 0 && status !== 'capturing' && (
                            <button
                                className="reset-button"
                                onClick={resetCapture}
                            >
                                Reset All
                            </button>
                        )}
                    </div>
                </>
            )}

            {status === 'error' && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                    <button onClick={retryCapture} className="retry-button">Retry</button>
                </div>
            )}
        </div>
    );
};

FingerprintCapture.propTypes = {
    onCapture: PropTypes.func.isRequired,
    onError: PropTypes.func,
    fingerCount: PropTypes.number,
};

export default FingerprintCapture;