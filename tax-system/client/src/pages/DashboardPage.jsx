import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taxService } from '../services/taxService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxService.getDeclarations()
      .then(d => setDeclarations(d?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner variant="dashboard" message="Đang tải tổng quan..." />;

  const totalTax  = declarations.reduce((s, d) => s + (d.taxAmount || 0), 0);
  const paidCount = declarations.filter(d => d.status === 'paid').length;
  const pendingCount = declarations.filter(d => d.status === 'pending' || d.status === 'overdue').length;

  return (
    <div className="page-container">
      <h1 className="page-title">
        🏠 Tổng quan
      </h1>

      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Xin chào, <strong>{user?.fullName}</strong>! Đây là tổng quan tài khoản thuế TNCN của bạn.
      </p>

      {/* Thống kê nhanh */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-icon">📋</p>
          <p className="stat-label">Tổng khai báo</p>
          <p className="stat-value">{declarations.length}</p>
        </div>
        <div className="stat-card success">
          <p className="stat-icon">✅</p>
          <p className="stat-label">Đã nộp thuế</p>
          <p className="stat-value">{paidCount}</p>
        </div>
        <div className="stat-card warn">
          <p className="stat-icon">⏳</p>
          <p className="stat-label">Chờ xử lý</p>
          <p className="stat-value">{pendingCount}</p>
        </div>
        <div className="stat-card highlight">
          <p className="stat-icon">💰</p>
          <p className="stat-label">Tổng thuế đã nộp</p>
          <p className="stat-value">{formatCurrency(totalTax)}</p>
        </div>
      </div>

      {/* Thao tác nhanh */}
      <div className="quick-actions">
        <h2>⚡ Thao tác nhanh</h2>
        <div className="action-grid">
          <Link to="/tax/calculator" className="action-card">
            <span className="action-icon">🧮</span>
            <span>Tính thuế nhanh</span>
          </Link>
          <Link to="/tax/declare" className="action-card">
            <span className="action-icon">📝</span>
            <span>Khai báo thuế</span>
          </Link>
          <Link to="/tax/history" className="action-card">
            <span className="action-icon">📋</span>
            <span>Lịch sử khai báo</span>
          </Link>
          <Link to="/reports" className="action-card">
            <span className="action-icon">📊</span>
            <span>Xem báo cáo</span>
          </Link>
        </div>
      </div>

      {/* Thông tin hữu ích */}
      <div className="card" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)', border: '1px solid #bfdbfe' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '0.75rem', fontSize: '1rem' }}>📌 Thông tin biểu thuế TNCN năm 2025</h3>
        <ul style={{ color: '#374151', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.25rem' }}>
          <li>Giảm trừ bản thân: <strong>11.000.000 đồng/tháng</strong></li>
          <li>Giảm trừ người phụ thuộc: <strong>4.400.000 đồng/tháng/người</strong></li>
          <li>Thuế suất từ <strong>5%</strong> đến <strong>35%</strong> theo bậc lũy tiến</li>
        </ul>
      </div>
    </div>
  );
}
