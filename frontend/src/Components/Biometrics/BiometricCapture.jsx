import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import FingerprintCapture from './FingerprintCapture.jsx';

const BiometricCapture = () => {
    // State for overall capture process
    const [captureStage, setCaptureStage] = useState('start'); // start, face, fingerprint, complete, error
    const [capturedData, setCapturedData] = useState({
        face: null,
        fingerprints: []
    });

    // Refs for face capture
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Face capture method
    const captureFace = async () => {
        try {
            setCaptureStage('face');

            // Ensure video stream is ready
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;

            // Wait for user to position face
            await new Promise(resolve => setTimeout(resolve, 2000));

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');

            // Detect face
            const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();

            if (detections.length > 0) {
                const faceData = {
                    image: imageData,
                    timestamp: new Date().toISOString(),
                    faceFeatures: detections[0],
                };

                setCapturedData(prev => ({ ...prev, face: faceData }));
                setCaptureStage('fingerprint');

                // Stop video stream
                streamRef.current.getTracks().forEach(track => track.stop());
            } else {
                throw new Error('No face detected');
            }
        } catch (error) {
            console.error('Face capture error:', error);
            setCaptureStage('error');
        }
    };

    // Fingerprint capture handler
    const handleFingerprintCapture = (fingerprintData) => {
        setCapturedData(prev => ({ ...prev, fingerprints: fingerprintData }));
        setCaptureStage('complete');
    };

    // Error handler
    const handleError = (error) => {
        console.error('Capture error:', error);
        setCaptureStage('error');
    };

    // Reset capture process
    const resetCapture = () => {
        setCaptureStage('start');
        setCapturedData({ face: null, fingerprints: [] });
    };

    // Load face detection models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
                await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            } catch (error) {
                console.error('Failed to load face detection models:', error);
                setCaptureStage('error');
            }
        };

        loadModels();
    }, []);

    // Render method
    return (
        <div className="biometric-capture-container">
            <h2>Biometric Capture</h2>

            {/* Start Stage */}
            {captureStage === 'start' && (
                <div className="start-capture">
                    <button onClick={captureFace}>Begin Biometric Capture</button>
                </div>
            )}

            {/* Face Capture Stage */}
            {captureStage === 'face' && (
                <div className="face-capture-stage">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{ width: '100%', maxWidth: '400px' }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <p>Please position your face in the camera view</p>
                </div>
            )}

            {/* Fingerprint Capture Stage */}
            {captureStage === 'fingerprint' && (
                <FingerprintCapture
                    onCapture={handleFingerprintCapture}
                    onError={handleError}
                    fingerCount={10}
                />
            )}

            {/* Capture Complete Stage */}
            {captureStage === 'complete' && (
                <div className="capture-complete">
                    <h3>Biometric Capture Complete</h3>
                    <div className="captured-summary">
                        <p>Face Captured: {capturedData.face ? 'Yes' : 'No'}</p>
                        <p>Fingerprints Captured: {capturedData.fingerprints.length} / 10</p>
                    </div>
                    <button onClick={() => {
                        // Here you would typically send the data to a backend
                        console.log('Captured Biometric Data:', capturedData);
                        alert('Biometric data captured successfully!');
                    }}>
                        Submit Biometric Data
                    </button>
                    <button onClick={resetCapture}>Recapture</button>
                </div>
            )}

            {/* Error Stage */}
            {captureStage === 'error' && (
                <div className="error-stage">
                    <p>An error occurred during biometric capture</p>
                    <button onClick={resetCapture}>Try Again</button>
                </div>
            )}
        </div>
    );
};

export default BiometricCapture;