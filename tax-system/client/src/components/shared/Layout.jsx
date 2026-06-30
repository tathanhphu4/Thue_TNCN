import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const navItems = [
  { path: '/dashboard',       label: '🏠 Tổng quan',     roles: ['user', 'admin'] },
  { path: '/tax/calculator',  label: '🧮 Tính thuế',     roles: ['user'] },
  { path: '/tax/declare',     label: '📝 Khai báo thuế', roles: ['user'] },
  { path: '/tax/history',     label: '📋 Lịch sử',       roles: ['user'] },
  { path: '/reports',         label: '📊 Báo cáo',       roles: ['user', 'admin'] },
  { path: '/admin',           label: '⚙️ Quản trị',      roles: ['admin'] },
  { path: '/profile',         label: '👤 Hồ sơ',         roles: ['user', 'admin'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef        = useRef(null);

  const handleLogout = () => { logout(); navigate('/login'); };
  const filtered = navItems.filter(i => i.roles.includes(user?.role));

  // Đóng sidebar khi click ra ngoài (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Khoá scroll body khi sidebar mở trên mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Đóng sidebar khi chuyển trang
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      {/* Backdrop overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">🏛️ TaxVN</h2>
          <p className="logo-sub">Hệ thống thuế TNCN</p>
        </div>
        <nav className="nav">
          {filtered.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="user-name" title={user?.email}>{user?.fullName}</p>
          <p className="user-role">{user?.role === 'admin' ? '🔑 Quản trị viên' : '👤 Người dùng'}</p>
          <button className="logout-btn" onClick={handleLogout}>Đăng xuất ↩</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Mở menu"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span className="page-title-topbar">
            Xin chào, <strong>{user?.fullName}</strong>
          </span>
        </div>
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
