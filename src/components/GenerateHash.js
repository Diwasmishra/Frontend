// src/components/GenerateHash.js
import React, { useState } from 'react';
import { ethers } from 'ethers';

const GenerateHash = () => {
    const [file, setFile] = useState(null);
    const [hash, setHash] = useState('');

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const generateHash = async () => {
        if (!file) {
            alert("Please upload a document first!");
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = async (event) => {
                const arrayBuffer = event.target.result;
                const fileHash = ethers.utils.keccak256(arrayBuffer); // Generate hash using ethers
                setHash(fileHash);
                console.log("Generated Hash: ", fileHash);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error generating hash:", error);
            alert('Error generating hash. Please try again.');
        }
    };

    return (
        <div>
            <h2>Upload Document and Generate Hash</h2>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={generateHash}>Generate Hash</button>
            {hash && (
                <div>
                    <p>Generated Hash: {hash}</p>
                </div>
            )}
        </div>
    );
};

export default GenerateHash;
