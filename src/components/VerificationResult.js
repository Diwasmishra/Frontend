import React from 'react';
import { useLocation } from 'react-router-dom';
import '../CSS/verifyResult.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VerificationResult = () => {
    const location = useLocation();
    const result = location.state.result;
    const studentName = location.state.studentName;
    const prn = location.state.prn;
    const tokenURI = location.state.tokenURI;  // ✅ This should be the full metadata URI
    const contractAddress = "0x171c240CD972D6bAC0EBC8a3ffeFf0FAE1474E64";

    const [nftMetadata, setNftMetadata] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await axios.get(tokenURI);
                setNftMetadata(response.data);
            } catch (error) {
                console.error("Error fetching NFT metadata from IPFS:", error);
            }
        };

        if (result && tokenURI) {
            fetchMetadata();
        }
    }, [result, tokenURI]);

    return (
        <div className="hero">
            <div>
                <h2 id='verify-heading'>Verification Result</h2>
                {result ? (
                    <>
                        <div className="success-box">
                            <p>✅ The document is valid and verified.</p>
                            <p><strong>Student Name:</strong> {studentName}</p>
                            <p><strong>PRN:</strong> {prn}</p>
                        </div>

                        <div className="nft-info">
                            <h3>🎓 NFT & Document Info</h3>
                            <p><strong>Metadata URI:</strong> <a href={tokenURI} target="_blank" rel="noopener noreferrer">{tokenURI}</a></p>
                            <p><strong>Smart Contract:</strong> <a href={`https://holesky.etherscan.io/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">Etherscan Link</a></p>
                        </div>

                        {nftMetadata && (
                            <div className="nft-metadata">
                                <h4>📄 NFT Metadata</h4>
                                {nftMetadata.name && <p><strong>Name:</strong> {nftMetadata.name}</p>}
                                {nftMetadata.description && <p><strong>Description:</strong> {nftMetadata.description}</p>}
                                {nftMetadata.prn && <p><strong>PRN:</strong> {nftMetadata.prn}</p>}
                                {nftMetadata.pdfLink && (
                                    <p>
                                        <strong>Document Link:</strong> <a href={nftMetadata.pdfLink} target="_blank" rel="noopener noreferrer">View PDF</a>
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="error-box">
                        <p>❌ The document could not be verified.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerificationResult;
