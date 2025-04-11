import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadDocument from './components/UploadDocument';
import SignDocument from './components/SignDocument';
import Confirmation from './components/Confirmation';
import VerificationForm from './components/VerificationForm'; // Corrected import
import QueryBlockchain from './components/QueryBlockchain';
import VerificationResult from './components/VerificationResult';
import First from './components/first';
import Login from './components/login';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/sign" element={<SignDocument />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/verify" element={<VerificationForm />} />
        <Route path="/result" element={<VerificationResult />} />
      </Routes>
    </Router>
  );
}

export default App;
