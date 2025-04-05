import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const DocumentPreview = ({ document }) => {
    const imageUrl = document.url; // Assuming you get the image URL from the document

    useEffect(() => {
        // Your effect logic here, e.g., fetching data or updating state
        console.log('Image URL changed:', imageUrl);

        // Cleanup or other logic if necessary
    }, [imageUrl]); // Include imageUrl in the dependency array

    return (
        <div className="document-preview">
            {imageUrl ? (
                <img src={imageUrl} alt="Document Preview" />
            ) : (
                <p>No document available to preview.</p>
            )}
        </div>
    );
};

DocumentPreview.propTypes = {
    document: PropTypes.shape({
        url: PropTypes.string,
    }).isRequired,
};

export default DocumentPreview;