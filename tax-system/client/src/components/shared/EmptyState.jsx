import React from 'react';

/**
 * EmptyState - Hiển thị khi danh sách trống
 * Props:
 *   icon    - emoji hoặc ký tự icon (mặc định '📭')
 *   title   - tiêu đề chính
 *   message - mô tả ngắn
 *   action  - { label: string, onClick: fn } (tùy chọn)
 */
export default function EmptyState({ icon = '📭', title = 'Không có dữ liệu', message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-msg">{message}</p>}
      {action && (
        <button className="btn-primary" onClick={action.onClick} style={{ width: 'auto', marginTop: '0.5rem' }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
