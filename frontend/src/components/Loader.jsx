// frontend/src/components/Loader.jsx

import React from 'react';

const loaderStyle = {
  border: '4px solid #f3f3f3', // Light grey
  borderTop: '4px solid #3498db', // Blue
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
  margin: '20px auto',
};

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function Loader() {
  return (
    <>
      <style>{keyframes}</style>
      <div style={loaderStyle}></div>
    </>
  );
}

export default Loader;