import React from 'react';
import './SpinnerOverlay.css'; // CSS for styling

const SpinnerOverlay = ({ isLoading }) => {
    if (!isLoading) return null; // Don't render if not loading

    return (
        <div className="spinner-overlay">
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
        </div>
    );
};

export default SpinnerOverlay;
