import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', color: '#333' }}>Trang không tồn tại</h1>
      <p style={{ color: '#666' }}>Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Link to="/dashboard" style={{
        padding: '0.75rem 1.5rem', background: '#4f46e5', color: '#fff',
        borderRadius: '8px', textDecoration: 'none', fontWeight: 600
      }}>
        ← Quay về Tổng quan
      </Link>
    </div>
  );
}
