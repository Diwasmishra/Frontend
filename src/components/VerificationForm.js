import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keccak256, getBytes, BrowserProvider, Contract } from 'ethers';
import axios from 'axios';
import { contractABI } from '../blockchain';
import '../CSS/verifyform.css';
import { motion } from 'motion/react';

const contractAddress = "0x171c240CD972D6bAC0EBC8a3ffeFf0FAE1474E64";

const VerificationForm = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please upload a document.");

        setLoading(true);
        setVerificationResult(null);

        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = async () => {
                const arrayBuffer = reader.result;
                const uint8Array = new Uint8Array(arrayBuffer);
                const hash = keccak256(uint8Array);

                console.log("Computed hash:", hash);

                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractAddress, contractABI, signer);

                // Fetch metadata URI using hash
                const tokenURI = await contract.getTokenURIByHash(hash);
                console.log("Fetched Token URI:", tokenURI);

                if (!tokenURI) {
                    setVerificationResult(false);
                    setLoading(false);
                    return;
                }

                const metadataResponse = await axios.get(tokenURI);
                const metadata = metadataResponse.data;

                console.log("Fetched Metadata:", metadata);

                navigate('/result', {
                    state: {
                        result: true,
                        studentName: metadata.name,
                        prn: metadata.prn,
                        ipfsHash: metadata.pdfLink.replace("https://gateway.pinata.cloud/ipfs/", ""),
                        documentHash: metadata.documentHash,
                        tokenURI: tokenURI
                    }
                });

                setVerificationResult(true);
            };
        } catch (err) {
            console.error("Verification failed:", err);
            setVerificationResult(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero">
            <div>
                <h2 id='verify-doc-head'>Verify Document</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".pdf"
                        id='doc-inp'
                        onChange={handleFileChange}
                        required
                    /><br /><br />
                    <motion.button whileTap={{ scale: 0.9 }} type="submit" id='verify-btn'>
                        Verify
                    </motion.button>
                </form>
                {loading && <p>Verifying document...</p>}
                {verificationResult === false && (
                    <p style={{ color: 'red' }}>Document not found or verification failed.</p>
                )}
            </div>
        </div>
    );
};

export default VerificationForm;
