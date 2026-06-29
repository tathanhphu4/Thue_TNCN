import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/layout.css';

const navItems = [
  { path: '/dashboard',       label: '🏠 Tổng quan',    roles: ['user', 'admin'] },
  { path: '/tax/calculator',  label: '🧮 Tính thuế',    roles: ['user'] },
  { path: '/tax/declare',     label: '📝 Khai báo thuế', roles: ['user'] },
  { path: '/tax/history',     label: '📋 Lịch sử',       roles: ['user'] },
  { path: '/reports',         label: '📊 Báo cáo',       roles: ['user', 'admin'] },
  { path: '/admin',           label: '⚙️ Quản trị',      roles: ['admin'] },
  { path: '/profile',         label: '👤 Hồ sơ',         roles: ['user', 'admin'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const filtered = navItems.filter(i => i.roles.includes(user?.role));

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
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
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="user-name">{user?.fullName}</p>
          <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="page-title">Xin chào, {user?.fullName}</span>
        </div>
        <div className="content-area">{children}</div>
      </main>
    </div>
  );
}
