import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DocumentPreview from '../ApplicationSteps/DocumentPreview.jsx';

const DocumentVerification = ({
                                  document,
                                  onVerify,
                                  onReject,
                                  autoVerify = false,
                                  verificationTimeout = 5000
                              }) => {
    const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verifying, verified, rejected, error
    const [verificationDetails, setVerificationDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Reset state when document changes
        if (document) {
            setVerificationStatus('pending');
            setVerificationDetails(null);
            setErrorMessage('');

            // Auto-verify if enabled
            if (autoVerify) {
                startVerification();
            }
        }
    }, [document, autoVerify]);

    const startVerification = async () => {
        if (!document) {
            setErrorMessage('No document to verify');
            setVerificationStatus('error');
            return;
        }

        try {
            setVerificationStatus('verifying');

            // Simulate document verification process
            await new Promise(resolve => setTimeout(resolve, verificationTimeout));

            // Mock verification result (80% success rate)
            const isVerified = Math.random() > 0.2;

            if (isVerified) {
                const verificationResult = {
                    documentId: document.id,
                    verificationId: `verify-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    status: 'verified',
                    confidence: 0.8 + Math.random() * 0.2, // 0.8 to 1.0
                    details: {
                        authenticity: {
                            score: 0.9 + Math.random() * 0.1,
                            features: ['watermark', 'microprint', 'hologram']
                        },
                        textExtraction: {
                            success: true,
                            fields: {
                                name: Math.random() > 0.9 ? null : 'Extracted Name',
                                documentNumber: Math.random() > 0.9 ? null : 'DOC123456789',
                                expiryDate: Math.random() > 0.9 ? null : '2025-12-31'
                            }
                        }
                    }
                };

                setVerificationDetails(verificationResult);
                setVerificationStatus('verified');
                onVerify && onVerify(verificationResult);
            } else {
                const rejectionReason = Math.random() > 0.5
                    ? 'Document appears to be altered or forged.'
                    : 'Document is expired or invalid.';

                const rejectionResult = {
                    documentId: document.id,
                    verificationId: `verify-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    status: 'rejected',
                    reason: rejectionReason,
                    details: {
                        issues: [
                            {
                                type: 'integrity',
                                description: rejectionReason
                            }
                        ]
                    }
                };

                setVerificationDetails(rejectionResult);
                setVerificationStatus('rejected');
                onReject && onReject(rejectionResult);
            }
        } catch (error) {
            console.error('Document verification error:', error);
            setErrorMessage(error.message || 'Verification failed');
            setVerificationStatus('error');
        }
    };

    const handleManualVerification = (isApproved) => {
        const result = {
            documentId: document.id,
            verificationId: `manual-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: isApproved ? 'verified' : 'rejected',
            method: 'manual',
            details: {
                manualReview: {
                    approved: isApproved,
                    reviewedAt: new Date().toISOString()
                }
            }
        };

        setVerificationDetails(result);
        setVerificationStatus(isApproved ? 'verified' : 'rejected');

        if (isApproved) {
            onVerify && onVerify(result);
        } else {
            onReject && onReject(result);
        }
    };

    return (
        <div className="document-verification-container">
            <h3>Document Verification</h3>

            <div className="document-preview-section">
                <DocumentPreview document={document} />
            </div>

            <div className="verification-status-section">
                {verificationStatus === 'pending' && (
                    <div className="verification-pending">
                        <p>Document is ready for verification</p>
                        <button onClick={startVerification} className="verify-button">
                            Start Verification
                        </button>
                    </div>
                )}

                {verificationStatus === 'verifying' && (
                    <div className="verification-in-progress">
                        <div className="spinner"></div>
                        <p>Verifying document...</p>
                        <p className="verification-sub-text">
                            This may take a few moments as we check the document's authenticity.
                        </p>
                    </div>
                )}

                {verificationStatus === 'verified' && (
                    <div className="verification-success">
                        <div className="success-icon">✓</div>
                        <h4>Document Verified</h4>
                        <p>This document has been successfully verified.</p>

                        {verificationDetails && (
                            <div className="verification-details">
                                <div className="detail-item">
                                    <span className="detail-label">Verification ID:</span>
                                    <span className="detail-value">{verificationDetails.verificationId}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Timestamp:</span>
                                    <span className="detail-value">
                    {new Date(verificationDetails.timestamp).toLocaleString()}
                  </span>
                                </div>
                                {verificationDetails.confidence && (
                                    <div className="detail-item">
                                        <span className="detail-label">Confidence:</span>
                                        <span className="detail-value">
                      {(verificationDetails.confidence * 100).toFixed(1)}%
                    </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {verificationStatus === 'rejected' && (
                    <div className="verification-rejected">
                        <div className="rejected-icon">✗</div>
                        <h4>Verification Failed</h4>
                        <p>
                            {verificationDetails?.reason ||
                                'This document could not be verified. Please upload a new document.'}
                        </p>

                        {verificationDetails?.details?.issues && (
                            <div className="rejection-details">
                                <h5>Issues Found:</h5>
                                <ul className="issues-list">
                                    {verificationDetails.details.issues.map((issue, index) => (
                                        <li key={index} className="issue-item">
                                            <strong>{issue.type}:</strong> {issue.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {verificationStatus === 'error' && (
                    <div className="verification-error">
                        <div className="error-icon">!</div>
                        <h4>Verification Error</h4>
                        <p>{errorMessage || 'An error occurred during verification'}</p>
                        <button onClick={startVerification} className="retry-button">
                            Retry Verification
                        </button>
                    </div>
                )}
            </div>

            {/* Manual verification controls (for admin use) */}
            <div className="manual-verification-controls">
                <h4>Manual Verification</h4>
                <p>Manually verify this document if automated verification fails.</p>
                <div className="manual-buttons">
                    <button
                        onClick={() => handleManualVerification(true)}
                        className="approve-button"
                        disabled={verificationStatus === 'verifying'}
                    >
                        Approve Document
                    </button>
                    <button
                        onClick={() => handleManualVerification(false)}
                        className="reject-button"
                        disabled={verificationStatus === 'verifying'}
                    >
                        Reject Document
                    </button>
                </div>
            </div>
        </div>
    );
};

DocumentVerification.propTypes = {
    document: PropTypes.shape({
        id: PropTypes.string.isRequired,
        documentType: PropTypes.string,
        filename: PropTypes.string,
        fileType: PropTypes.string,
        fileSize: PropTypes.number,
        url: PropTypes.string,
        file: PropTypes.object,
        data: PropTypes.string,
        uploadDate: PropTypes.string,
    }),
    onVerify: PropTypes.func,
    onReject: PropTypes.func,
    autoVerify: PropTypes.bool,
    verificationTimeout: PropTypes.number,
};

export default DocumentVerification;