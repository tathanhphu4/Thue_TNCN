import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taxService } from '../services/taxService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import '../styles/dashboard.css';

export default function ReportPage() {
  const { user } = useAuth();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxService.getDeclarations()
      .then(data => setDeclarations(data?.data || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Đang tải báo cáo..." />;

  // Tổng hợp theo năm
  const byYear = {};
  declarations.forEach(d => {
    const y = d.year || '?';
    if (!byYear[y]) byYear[y] = { declarations: [], totalIncome: 0, totalTax: 0 };
    byYear[y].declarations.push(d);
    byYear[y].totalIncome += d.totalIncome || 0;
    byYear[y].totalTax += d.taxAmount || 0;
  });

  const totalPaid = declarations.filter(d => d.status === 'paid').reduce((s, d) => s + (d.taxAmount || 0), 0);
  const totalIncome = declarations.reduce((s, d) => s + (d.totalIncome || 0), 0);

  return (
    <div className="page-container">
      <h1 className="page-title">📊 Báo cáo thuế</h1>

      {/* Tóm tắt */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <p className="stat-label">Tổng khai báo</p>
          <p className="stat-value">{declarations.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tổng thu nhập</p>
          <p className="stat-value" style={{ fontSize: '1rem' }}>{formatCurrency(totalIncome)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tổng thuế đã nộp</p>
          <p className="stat-value" style={{ fontSize: '1rem' }}>{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {/* Theo năm */}
      {Object.keys(byYear).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Chưa có dữ liệu khai báo nào.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(byYear).sort(([a],[b]) => b - a).map(([year, data]) => (
            <div key={year} style={{
              background: '#fff', borderRadius: '12px', padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>Năm {year}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>Số khai báo</p>
                  <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0, color: '#4f46e5' }}>{data.declarations.length}</p>
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>Tổng thu nhập</p>
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: '#1a1a2e' }}>{formatCurrency(data.totalIncome)}</p>
                </div>
                <div>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>Tổng thuế</p>
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: '#ef4444' }}>{formatCurrency(data.totalTax)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
