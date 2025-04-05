import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FacialRecognition = ({ onCapture, onError }) => {
  const [status, setStatus] = useState('initializing');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Update this path to where your face-api.js models are stored
        const MODEL_URL = '/models';

        // Load the required face-api.js models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        // After models are loaded, start the webcam
        startWebcam();
      } catch (err) {
        console.error('Failed to load models:', err);
        setStatus('error');
        setErrorMessage('Failed to initialize facial recognition.');
        if (onError) onError(err);
      }
    };

    loadModels();

    // Cleanup function to stop webcam when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onError]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStatus('ready');
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setStatus('error');
      setErrorMessage('Unable to access camera.');
      if (onError) onError(err);
    }
  };

  const captureFace = async () => {
    if (status !== 'ready') return;

    try {
      setStatus('capturing');

      // Give user some time to prepare
      await new Promise(resolve => setTimeout(resolve, 1000));

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');

      setStatus('processing');

      // Detect face using face-api.js
      const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (detections.length > 0) {
        const faceData = {
          image: imageData,
          timestamp: new Date().toISOString(),
          faceFeatures: detections[0], // Use the first detected face
        };

        setStatus('success');
        onCapture(faceData);
      } else {
        throw new Error('No face detected. Please try again.');
      }

      // Stop the camera after successful capture
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Error capturing face:', err);
      setStatus('error');
      setErrorMessage('Failed to capture facial image.');
      if (onError) onError(err);
    }
  };

  const retryCapture = () => {
    setStatus('ready');
    setErrorMessage('');

    // Ensure webcam is running
    if (!streamRef.current || streamRef.current.getTracks()[0].readyState !== 'live') {
      startWebcam();
    }
  };

  return (
    <div className="facial-recognition-container">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ display: status === 'success' ? 'none' : 'block' }}
          onLoadedMetadata={() => videoRef.current.play()}
        />
        <canvas
          ref={canvasRef}
          style={{ display: status === 'success' ? 'block' : 'none' }}
        />
      </div>

      <div className="status-container">
        {status === 'initializing' && <p>Initializing facial recognition...</p>}
        {status === 'ready' && <p>Camera ready. Position your face in the frame.</p>}
        {status === 'capturing' && <p>Capturing image...</p>}
        {status === 'processing' && <p>Processing image...</p>}
        {status === 'error' && <p className="error">{errorMessage}</p>}
        {status === 'success' && <p>Facial image captured successfully!</p>}
      </div>

      <div className="controls">
        {status === 'ready' && (
          <button onClick={captureFace} className="capture-btn">
            Capture Image
          </button>
        )}
        {status === 'error' && (
          <button onClick={retryCapture} className="retry-btn">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default FacialRecognition;