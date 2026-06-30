import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taxService } from '../services/taxService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, paid: 0, totalTax: 0 });

  useEffect(() => {
    taxService.getDeclarations()
      .then(data => {
        const declarations = data?.data || data || [];
        const paid = declarations.filter(d => d.status === 'paid');
        setStats({
          total: declarations.length,
          paid: paid.length,
          totalTax: paid.reduce((s, d) => s + (d.taxAmount || 0), 0),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">👤 Hồ sơ cá nhân</h1>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: '#fff', fontWeight: 700, flexShrink: 0
          }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#1a1a2e' }}>{user?.fullName}</h2>
            <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.9rem' }}>{user?.email}</p>
            <span style={{
              display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.75rem',
              background: user?.role === 'admin' ? '#fef3c7' : '#ede9fe',
              color: user?.role === 'admin' ? '#92400e' : '#5b21b6',
              borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600
            }}>
              {user?.role === 'admin' ? '⚙️ Quản trị viên' : '👤 Người dùng'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4f46e5', margin: 0 }}>{stats.total}</p>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Tổng khai báo</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981', margin: 0 }}>{stats.paid}</p>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Đã nộp thuế</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', margin: 0 }}>
              {stats.totalTax.toLocaleString('vi-VN')}đ
            </p>
            <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Tổng đã nộp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
