import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể tải danh sách người dùng.');
      setUsers(data.data || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <LoadingSpinner message="Đang tải dữ liệu quản trị..." />;

  return (
    <div className="page-container">
      <h1 className="page-title">⚙️ Quản trị hệ thống</h1>

      {error && (
        <div style={{
          background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px',
          padding: '1rem', color: '#c0392b', marginBottom: '1.5rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Danh sách người dùng</h2>
          <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
            {users.length} người dùng
          </span>
        </div>

        {users.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Không có người dùng nào.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888', fontWeight: 600 }}>Họ tên</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888', fontWeight: 600 }}>Vai trò</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888', fontWeight: 600 }}>Trạng thái</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#888', fontWeight: 600 }}>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{u.fullName}</td>
                    <td style={{ padding: '0.75rem', color: '#666' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                        background: u.role === 'admin' ? '#fef3c7' : '#ede9fe',
                        color: u.role === 'admin' ? '#92400e' : '#5b21b6',
                      }}>
                        {u.role === 'admin' ? '⚙️ Admin' : '👤 User'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
                        background: u.isActive ? '#d1fae5' : '#fee2e2',
                        color: u.isActive ? '#065f46' : '#991b1b',
                      }}>
                        {u.isActive ? '✅ Hoạt động' : '🔒 Bị khóa'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.85rem' }}>
                      {u.createdAt ? formatDate(u.createdAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
