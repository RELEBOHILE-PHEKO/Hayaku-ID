import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DocumentPreview = ({ document, onRemove, onRotate, onZoom }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const loadDocument = async () => {
            if (!document) {
                setError('No document provided');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Determine the URL to use for preview
                if (typeof document.url === 'string') {
                    setImageUrl(document.url);
                } else if (document.file instanceof File) {
                    setImageUrl(URL.createObjectURL(document.file));
                } else if (document.data) {
                    setImageUrl(document.data);
                } else {
                    throw new Error('No viewable content in document');
                }
            } catch (err) {
                console.error('Error loading document:', err);
                setError(err.message || 'Failed to load document');
            } finally {
                setIsLoading(false);
            }
        };

        loadDocument(); // Call the async function

        // Cleanup function to revoke object URLs
        return () => {
            if (imageUrl && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [document]); // Depend on document

    const handleRotate = (direction) => {
        const newRotation = direction === 'right'
            ? (rotation + 90) % 360
            : (rotation - 90 + 360) % 360;

        setRotation(newRotation);
        onRotate && onRotate(newRotation);
    };

    const handleZoom = (factor) => {
        const newZoom = Math.max(0.5, Math.min(3, zoom * factor));
        setZoom(newZoom);
        onZoom && onZoom(newZoom);
    };

    const getDocumentType = () => {
        if (!document) return 'unknown';

        if (document.file && document.file.type) {
            return document.file.type;
        } else if (document.fileType) {
            return document.fileType;
        } else if (document.filename) {
            const ext = document.filename.split('.').pop().toLowerCase();
            if (['pdf'].includes(ext)) return 'application/pdf';
            if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
            return ext;
        }

        return 'unknown';
    };

    const documentType = getDocumentType();
    const isPdf = documentType === 'application/pdf';

    return (
        <div className="document-preview-container">
            <div className="preview-header">
                <h3>{document?.documentType || 'Document'} Preview</h3>
                <div className="preview-actions">
                    {!isPdf && (
                        <>
                            <button
                                onClick={() => handleRotate('left')}
                                className="rotate-left-button"
                                title="Rotate left"
                            >
                                ↺
                            </button>
                            <button
                                onClick={() => handleRotate('right')}
                                className="rotate-right-button"
                                title="Rotate right"
                            >
                                ↻
                            </button>
                            <button
                                onClick={() => handleZoom(1.2)}
                                className="zoom-in-button"
                                title="Zoom in"
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleZoom(0.8)}
                                className="zoom-out-button"
                                title="Zoom out"
                            >
                                −
                            </button>
                        </>
                    )}
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="remove-button"
                            title="Remove document"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className="preview-content">
                {isLoading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Loading document...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && imageUrl && (
                    <div className="image-container">
                        {isPdf ? (
                            <iframe
                                src={`${imageUrl}#view=FitH`}
                                title="PDF Document"
                                className="pdf-frame"
                            />
                        ) : (
                            <img
                                src={imageUrl}
                                alt="Document preview"
                                className="document-image"
                                style={{
                                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                                    transition: 'transform 0.3s ease-in-out'
                                }}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="document-info">
                {document && (
                    <>
                        <div className="document-filename">
                            {document.filename || 'Unnamed document'}
                        </div>
                        {document.fileSize && (
                            <div className="document-filesize">
                                {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </div>
                        )}
                        {document.uploadDate && (
                            <div className="document-upload-date">
                                Uploaded: {new Date(document.uploadDate).toLocaleString()}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

DocumentPreview.propTypes = {
    document: PropTypes.shape({
        id: PropTypes.string,
        documentType: PropTypes.string,
        filename: PropTypes.string,
        fileType: PropTypes.string,
        fileSize: PropTypes.number,
        url: PropTypes.string,
        file: PropTypes.object,
        data: PropTypes.string,
        uploadDate: PropTypes.string,
    }),
    onRemove: PropTypes.func,
    onRotate: PropTypes.func,
    onZoom: PropTypes.func,
};

export default DocumentPreview;