import React from 'react';

export default function LoadingSpinner({ message = 'Đang tải...' }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem', gap:'1rem' }}>
      <div className="spinner" />
      <p style={{ color:'#666' }}>{message}</p>
    </div>
  );
}
