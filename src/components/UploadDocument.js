import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { keccak256, getBytes, BrowserProvider, Contract } from 'ethers';
import { getSession, clearSession } from '../SessionManager';
import { contractABI } from '../blockchain';
import HandleLogout from './LogoutButton';
import axios from 'axios';
import "../CSS/uploader.css";

const contractAddress = "0x171c240CD972D6bAC0EBC8a3ffeFf0FAE1474E64";
const pinataApiUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const pinataApiKey = 'ca6f527e731b295e1288';
const pinataApiSecret = '1cea24fd0a03b66cb2fb173abc774d69bc53b679ce064b816d6aa7dc6138218e';

const UploadDocument = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);

    useEffect(() => {
        const session = getSession();
        if (!session) {
            clearSession();
            navigate('/login');
        }
    }, [navigate]);

    const handleFileChange = (event, index) => {
        const files = [...students];
        files[index].marksheet = event.target.files[0];
        setStudents(files);
    };

    const handleAddStudent = () => {
        setStudents([...students, { studentName: '', prn: '', marksheet: null }]);
    };

    const handleChange = (index, field, value) => {
        const updatedStudents = [...students];
        if (field === 'prn') {
            value = value.replace(/\D/g, '').slice(0, 16);
        }
        if (field === 'studentName' && !/^[A-Za-z ]{0,50}$/.test(value)) return;
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    const handleBatchUpload = async (event) => {
        event.preventDefault();
        if (students.length === 0) {
            alert("Please add at least one student.");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            let studentNames = [];
            let prns = [];
            let marksheetHashes = [];
            let metadataURIs = [];

            for (const student of students) {
                const { studentName, prn, marksheet } = student;

                if (!studentName || studentName.length < 2 || studentName.length > 50 || !/^[A-Za-z ]+$/.test(studentName)) {
                    alert(`Invalid name for ${studentName}`);
                    return;
                }
                if (!prn || prn.length !== 16 || !/^\d{16}$/.test(prn)) {
                    alert(`Invalid PRN for ${studentName}`);
                    return;
                }
                if (!marksheet) {
                    alert(`No file for ${studentName}`);
                    return;
                }

                // 1. Upload PDF to IPFS
                const formData = new FormData();
                formData.append('file', marksheet);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        pinata_api_key: pinataApiKey,
                        pinata_secret_api_key: pinataApiSecret
                    }
                };
                const ipfsResponse = await axios.post(pinataApiUrl, formData, config);
                const pdfHash = ipfsResponse.data.IpfsHash;
                const pdfLink = `https://gateway.pinata.cloud/ipfs/${pdfHash}`;

                // 2. Compute keccak256 hash of the PDF file
                const arrayBuffer = await marksheet.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                const documentHash = keccak256(uint8Array); // 0x-prefixed

                // 3. Create metadata
                const metadata = {
                    name: studentName,
                    prn,
                    documentHash: documentHash.slice(2), // Remove "0x" prefix for metadata
                    pdfLink
                };
                const metadataResponse = await axios.post(
                    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                    metadata,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            pinata_api_key: pinataApiKey,
                            pinata_secret_api_key: pinataApiSecret
                        }
                    }
                );
                const metadataURI = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;

                // Prepare values for smart contract
                studentNames.push(studentName);
                prns.push(prn);
                marksheetHashes.push(getBytes(documentHash)); // pass bytes for keccak hash
                metadataURIs.push(metadataResponse.data.IpfsHash);
            }

            // 4. Upload to blockchain
            setUploadStatus({ message: "Uploading to blockchain...", success: null });
            const tx = await contract.uploadMultipleMarkSheets(studentNames, prns, marksheetHashes, metadataURIs);
            await tx.wait();

            // 5. Mint NFTs
            for (let i = 0; i < metadataURIs.length; i++) {
                const mintTx = await contract.mintCertificateNFT(
                    signer.address,
                    `https://gateway.pinata.cloud/ipfs/${metadataURIs[i]}`,
                    marksheetHashes[i]
                );
                await mintTx.wait();
                console.log(`NFT minted for ${studentNames[i]} with URI: https://gateway.pinata.cloud/ipfs/${metadataURIs[i]}`);
            }

            setUploadStatus({ success: true, message: "Batch upload and NFT minting successful!" });

        } catch (err) {
            console.error("Batch upload failed:", err);
            setUploadStatus({ success: false, message: "Batch upload failed. Try again." });
        }
    };

    return (
        <>
            <HandleLogout />
            <div className="hero">
                <div className="scroll-container">
                    <h1>Batch Upload Documents</h1>
                    <form onSubmit={handleBatchUpload}>
                        {students.map((student, index) => (
                            <div key={index}>
                                <br />
                                <input
                                    type="text"
                                    placeholder="Student Name"
                                    value={student.studentName}
                                    onChange={(e) => handleChange(index, 'studentName', e.target.value)}
                                    required
                                />
                                <br /><br />
                                <input
                                    type="text"
                                    placeholder="PRN NUMBER"
                                    value={student.prn}
                                    onChange={(e) => handleChange(index, 'prn', e.target.value)}
                                    required
                                />
                                <br />
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(e, index)}
                                    required
                                />
                                <hr className="hr" />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddStudent}>+ Add Student</button>
                        <button type="submit">Batch Upload</button>
                    </form>
                    {uploadStatus && (
                        <p style={{ color: uploadStatus.success ? 'green' : 'red' }}>
                            {uploadStatus.message}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default UploadDocument;
