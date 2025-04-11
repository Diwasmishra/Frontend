import React, { useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from '../blockchain'; // Adjust this path if necessary

const contractAddress = "0x244c2d2ccdeb96b7712d7339e5a021995F68359a"// Replace with your actual contract address

const QueryBlockchain = () => {
    const [hash, setHash] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    const handleQuery = async () => {
        try {
            // Connect to blockchain
            const provider = new ethers.BrowserProvider(window.ethereum); // Correct usage for version 6
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call verifyMarksheet method from the contract
            const result = await contract.verifyMarksheet(hash); // Ensure you're passing the correct parameters
            setVerificationResult(result);
        } catch (error) {
            console.error("Error verifying document:", error);
            alert("Error verifying document. Check console for details.");
        }
    };

    return (
        <div>
            <h2>Query Blockchain for Verification</h2>
            <input
                type="text"
                placeholder="Enter Document Hash"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
            />
            <button onClick={handleQuery}>Verify Document</button>
            {verificationResult !== null && (
                <div>
                    <p>Verification Result: {verificationResult ? 'Valid' : 'Invalid'}</p>
                </div>
            )}
        </div>
    );
};

export default QueryBlockchain;
