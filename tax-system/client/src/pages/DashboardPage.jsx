import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taxService } from '../services/taxService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxService.getDeclarations()
      .then(d => setDeclarations(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalTax  = declarations.reduce((s, d) => s + d.taxAmount, 0);
  const paidCount = declarations.filter(d => d.status === 'paid').length;

  return (
    <div className="page-container">
      <h1 className="page-title">Tong quan</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Tong khai bao</p>
          <p className="stat-value">{declarations.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Da nop thue</p>
          <p className="stat-value">{paidCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tong thue</p>
          <p className="stat-value">{totalTax.toLocaleString('vi-VN')} VND</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Thao tac nhanh</h2>
        <div className="action-grid">
          <Link to="/tax/calculator" className="action-card">
            <span className="action-icon">C</span>
            <span>Tinh thue nhanh</span>
          </Link>
          <Link to="/tax/declare" className="action-card">
            <span className="action-icon">K</span>
            <span>Khai bao thue</span>
          </Link>
          <Link to="/tax/history" className="action-card">
            <span className="action-icon">L</span>
            <span>Lich su khai bao</span>
          </Link>
          <Link to="/reports" className="action-card">
            <span className="action-icon">B</span>
            <span>Xem bao cao</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
