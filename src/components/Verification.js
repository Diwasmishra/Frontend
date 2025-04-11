import React, { useState } from 'react';
import { verifyMarksheet } from '../blockchain';

const VerificationForm = () => {
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [providedHash, setProvidedHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    const isValid = await verifyMarksheet(studentRollNumber, providedHash);
    setVerificationResult(isValid ? 'Marksheet is valid!' : 'Marksheet is invalid.');
  };

  return (
    <div>
      <h2>Verify Marksheet</h2>
      <input
        type="text"
        placeholder="Roll Number"
        value={studentRollNumber}
        onChange={(e) => setStudentRollNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Marksheet Hash"
        value={providedHash}
        onChange={(e) => setProvidedHash(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
      {verificationResult && <p>{verificationResult}</p>}
    </div>
  );
};

export default VerificationForm;
