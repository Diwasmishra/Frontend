import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import crypto from 'crypto-js';

const SignDocument = () => {
    const location = useLocation();
    const { hashValue } = location.state || {}; // Destructure the hash value passed from UploadDocument
    const [signature, setSignature] = useState('');

    // Function to create a digital signature
    const createSignature = () => {
        if (hashValue) {
            const privateKey = '0x171c240CD972D6bAC0EBC8a3ffeFf0FAE1474E64'; // Replace with your actual private key
            const generatedSignature = crypto.HmacSHA256(hashValue, privateKey).toString();
            setSignature(generatedSignature);
            console.log('Digital Signature:', generatedSignature);
            return generatedSignature;
        } else {
            console.error('No hash value provided.');
            return null;
        }
    };

    return (
        <div>
            <h2>Sign Document</h2>
            <p>Hash Value: {hashValue}</p>
            <button onClick={createSignature}>Create Digital Signature</button>
            {signature && (
                <div>
                    <h3>Digital Signature</h3>
                    <p>{signature}</p>
                </div>
            )}
        </div>
    );
};

export default SignDocument;
