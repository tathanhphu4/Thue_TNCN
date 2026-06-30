import React from 'react';

/**
 * LoadingSpinner component with loading skeleton variant support
 * Props:
 *   message - label message
 *   variant - 'spinner' | 'card' | 'table' | 'dashboard'
 *   rows    - number of rows to render for table/card skeleton
 */
export default function LoadingSpinner({
  message = 'Đang tải dữ liệu...',
  variant = 'spinner',
  rows = 4
}) {
  if (variant === 'card') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', padding: '1rem 0' }}>
        {Array.from({ length: Math.min(rows, 10) }).map((_, idx) => (
          <div key={idx} className="card skeleton" style={{ minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
            <div className="skeleton-title" style={{ width: '40%', height: '18px', background: '#e2e8f0', borderRadius: '4px' }}></div>
            <div className="skeleton-text" style={{ width: '80%', height: '12px', background: '#cbd5e1', borderRadius: '4px' }}></div>
            <div className="skeleton-text" style={{ width: '60%', height: '12px', background: '#cbd5e1', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="data-table-wrapper" style={{ padding: '1rem 0' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} style={{ height: '40px' }}>
                  <div className="skeleton" style={{ height: '16px', width: '60%', background: 'rgba(255,255,255,0.25)', borderRadius: '4px' }}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                {Array.from({ length: 5 }).map((_, cIdx) => (
                  <td key={cIdx} style={{ padding: '1rem 0.75rem' }}>
                    <div className="skeleton" style={{ height: '14px', width: cIdx === 0 ? '40%' : '75%', borderRadius: '4px' }}></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Grid cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card skeleton" style={{ height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
              <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px' }}></div>
              <div className="skeleton" style={{ height: '28px', width: '70%', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>
        {/* Table representation */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="skeleton" style={{ height: '20px', width: '30%', marginBottom: '1.5rem', borderRadius: '4px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '35px', width: '100%', borderRadius: '4px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}
