import * as faceapi from 'face-api.js';

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
        onError && onError(err);
    }
};