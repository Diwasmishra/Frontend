import React from 'react';
import { clearSession } from '../SessionManager';
import { useNavigate } from 'react-router-dom';

function HandleLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <button
      style={{
        position: 'fixed',  // Keep it fixed on the screen
        top: '10px',        // Distance from the top
        left: '10px',       // Distance from the left
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        outline: 'none',
        transition: 'background-color 0.3s',
        zIndex: 1000 // Ensure it stays above other elements
      }}
      onClick={handleLogout}
      onMouseOver={(e) => (e.target.style.backgroundColor = 'darkred')}
      onMouseOut={(e) => (e.target.style.backgroundColor = 'red')}
    >
      Logout
    </button>
  );
}

export default HandleLogout;

