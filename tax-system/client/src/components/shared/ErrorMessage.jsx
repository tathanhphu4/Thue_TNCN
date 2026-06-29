import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background:'#fff0f0', border:'1px solid #ffcccc',
      borderRadius:'6px', padding:'0.75rem 1rem', color:'#c0392b',
      marginBottom:'1rem', fontSize:'0.9rem'
    }}>
      ⚠️ {message}
    </div>
  );
}
