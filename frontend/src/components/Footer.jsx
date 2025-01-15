// Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '1rem 0',
      position: 'relative',
      width: '100%',
      zIndex: 2,
    }}>
      {/* Copyright Section */}
      <div style={{
        textAlign: 'center',
    
        color: '#9ca3af',
        fontSize: '0.875rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Resource Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;