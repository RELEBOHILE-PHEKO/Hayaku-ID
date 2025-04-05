import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const DocumentUpload = ({
                            documentType,
                            acceptedFileTypes = '.jpg,.jpeg,.png,.pdf',
                            maxFileSizeMB = 5,
                            onUpload,
                            onError
                        }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        // Validate file type
        const fileType = selectedFile.type;
        const fileExtension = `.${selectedFile.name.split('.').pop().toLowerCase()}`;
        const acceptedTypes = acceptedFileTypes.split(',');

        if (!acceptedTypes.some(type =>
            type === fileExtension ||
            type === `.${fileType.split('/')[1]}` ||
            type === fileType
        )) {
            setErrorMessage(`Invalid file type. Please upload one of: ${acceptedFileTypes}`);
            setUploadStatus('error');
            onError && onError(new Error(`Invalid file type: ${fileType}`));
            return;
        }

        // Validate file size
        if (selectedFile.size > maxFileSizeMB * 1024 * 1024) {
            setErrorMessage(`File is too large. Maximum allowed size is ${maxFileSizeMB}MB`);
            setUploadStatus('error');
            onError && onError(new Error(`File too large: ${selectedFile.size}`));
            return;
        }

        // Set file and create preview
        setFile(selectedFile);

        if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        } else if (fileType === 'application/pdf') {
            setPreview('pdf');
        } else {
            setPreview('document');
        }

        setUploadStatus('idle');
        setErrorMessage('');
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploadStatus('uploading');
            setUploadProgress(0);

            // Simulate file upload with progress
            const totalTime = 3000; // 3 seconds for upload simulation
            const interval = 100; // Update progress every 100ms
            const steps = totalTime / interval;
            let currentStep = 0;

            const progressInterval = setInterval(() => {
                currentStep++;
                const progress = Math.min(Math.floor((currentStep / steps) * 100), 99);
                setUploadProgress(progress);

                if (currentStep >= steps) {
                    clearInterval(progressInterval);
                }
            }, interval);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, totalTime));

            // Complete upload
            setUploadProgress(100);
            setUploadStatus('success');

            // Prepare response data
            const uploadedDocument = {
                id: `doc-${Date.now()}`,
                filename: file.name,
                documentType,
                fileType: file.type,
                fileSize: file.size,
                uploadDate: new Date().toISOString(),
                status: 'uploaded', // uploaded, verified, rejected
            };

            // Notify parent component
            onUpload && onUpload(uploadedDocument);

        } catch (error) {
            console.error('Document upload failed:', error);
            setUploadStatus('error');
            setErrorMessage(error.message || 'Failed to upload document');
            onError && onError(error);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setPreview(null);
        setUploadStatus('idle');
        setErrorMessage('');
        setUploadProgress(0);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="document-upload-container">
            <h3>{documentType} Upload</h3>

            {uploadStatus !== 'success' && (
                <div className="upload-section">
                    <div className="upload-instructions">
                        <p>Please upload a clear, legible copy of your {documentType}.</p>
                        <ul className="upload-requirements">
                            <li>Accepted formats: {acceptedFileTypes}</li>
                            <li>Maximum file size: {maxFileSizeMB}MB</li>
                            <li>Make sure all text is clearly visible</li>
                        </ul>
                    </div>

                    <div
                        className={`upload-area ${file ? 'has-file' : ''}`}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept={acceptedFileTypes}
                            style={{ display: 'none' }}
                        />

                        {!file && (
                            <div className="upload-placeholder">
                                <div className="upload-icon">↑</div>
                                <p>Click to select file or drag and drop</p>
                            </div>
                        )}

                        {file && preview && (
                            <div className="file-preview">
                                {preview === 'pdf' && (
                                    <div className="pdf-preview">
                                        <div className="pdf-icon">PDF</div>
                                    </div>
                                )}

                                {preview === 'document' && (
                                    <div className="doc-preview">
                                        <div className="doc-icon">DOC</div>
                                    </div>
                                )}

                                {preview !== 'pdf' && preview !== 'document' && (
                                    <img
                                        src={preview}
                                        alt="Document preview"
                                        className="image-preview"
                                    />
                                )}

                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {uploadStatus === 'uploading' && (
                        <div className="upload-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <span className="progress-percentage">{uploadProgress}%</span>
                        </div>
                    )}

                    {file && uploadStatus !== 'uploading' && (
                        <div className="upload-actions">
                            <button onClick={resetUpload} className="reset-button">
                                Change File
                            </button>
                            <button onClick={handleUpload} className="upload-button">
                                Upload Document
                            </button>
                        </div>
                    )}
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="upload-success">
                    <div className="success-icon">✓</div>
                    <h4>Upload Successful</h4>
                    <p>Your {documentType} has been uploaded successfully.</p>
                    <button onClick={resetUpload} className="new-upload-button">
                        Upload Another Document
                    </button>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="upload-error">
                    <div className="error-icon">✗</div>
                    <p>{errorMessage}</p>
                    <button onClick={resetUpload} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

DocumentUpload.propTypes = {
    documentType: PropTypes.string.isRequired,
    acceptedFileTypes: PropTypes.string,
    maxFileSizeMB: PropTypes.number,
    onUpload: PropTypes.func.isRequired,
    onError: PropTypes.func,
};

export default DocumentUpload;