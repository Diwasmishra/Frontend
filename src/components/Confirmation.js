// src/components/Confirmation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const navigate = useNavigate();

    const handleReturn = () => {
        // Navigate back to the upload page or wherever you want
        navigate('/upload');
    };

    return (
        <div>
            <h2>Submission Confirmation</h2>
            <p>Your document has been successfully uploaded, signed, and recorded.</p>
            <button onClick={handleReturn}>Upload Another Document</button>
        </div>
    );
};

export default Confirmation;
