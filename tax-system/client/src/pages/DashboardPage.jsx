import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taxService } from '../services/taxService';
import { reportService } from '../services/reportService';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import '../styles/dashboard.css';

/* ═══════════════════════════════════════════════════════════ */
/*   ADMIN DASHBOARD                                          */
/* ═══════════════════════════════════════════════════════════ */
function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalUsers: 0, totalDeclarations: 0, totalTaxCollected: 0 });
  const [users, setUsers] = useState([]);
  const [declarations, setDeclarations] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [summaryRes, usersRes, declsRes] = await Promise.all([
          reportService.getSystemSummary(),
          userService.getAllUsers(),
          taxService.getAllDeclarations(),
        ]);
        setSummary(summaryRes.data || summaryRes || {});
        setUsers(usersRes.data || usersRes || []);
        setDeclarations(declsRes.data || declsRes || []);
      } catch (err) {
        console.error('Lỗi tải dữ liệu tổng quan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner variant="dashboard" message="Đang tải tổng quan hệ thống..." />;

  // Stats
  const pendingCount = declarations.filter(d => d.status === 'pending' || d.status === 'overdue').length;
  const paidCount = declarations.filter(d => d.status === 'paid').length;

  // 5 người dùng mới nhất
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 5 tờ khai gần đây nhất
  const recentDeclarations = [...declarations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Dữ liệu biểu đồ doanh thu theo năm
  const chartMap = {};
  declarations.forEach(d => {
    if (!chartMap[d.year]) {
      chartMap[d.year] = { year: String(d.year), 'Thuế đã thu': 0, 'Số tờ khai': 0 };
    }
    chartMap[d.year]['Số tờ khai'] += 1;
    if (d.status === 'paid') {
      chartMap[d.year]['Thuế đã thu'] += d.taxAmount || 0;
    }
  });
  const chartData = Object.values(chartMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  const statusMap = {
    draft: { label: 'Nháp', cls: 'draft' },
    pending: { label: 'Chờ nộp', cls: 'draft' },
    submitted: { label: 'Đã gửi', cls: 'submitted' },
    paid: { label: 'Đã nộp thuế', cls: 'paid' },
    overdue: { label: 'Quá hạn', cls: 'overdue' },
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🏠 Tổng quan hệ thống</h1>
      <p className="dash-welcome">
        Xin chào, <strong>{user?.fullName}</strong>! Đây là bảng điều khiển quản trị hệ thống thuế TNCN.
      </p>

      {/* ─── Stat Cards ──────────────────────────────── */}
      <div className="stats-grid stats-grid-4">
        <div className="stat-card stat-blue">
          <div className="stat-icon-circle blue">👥</div>
          <div>
            <p className="stat-label">Tổng người dùng</p>
            <p className="stat-value">{summary.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-icon-circle amber">📋</div>
          <div>
            <p className="stat-label">Tổng tờ khai</p>
            <p className="stat-value">{summary.totalDeclarations}</p>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon-circle green">💰</div>
          <div>
            <p className="stat-label">Tổng thuế đã thu</p>
            <p className="stat-value stat-value-green">{formatCurrency(summary.totalTaxCollected)}</p>
          </div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon-circle red">⏳</div>
          <div>
            <p className="stat-label">Chờ xử lý</p>
            <p className="stat-value stat-value-red">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* ─── Truy cập nhanh ──────────────────────────── */}
      <div className="quick-actions">
        <h2>🔗 Truy cập nhanh</h2>
        <div className="action-grid action-grid-3">
          <Link to="/admin" className="action-card" state={{ tab: 'users' }}>
            <span className="action-icon">👤</span>
            <span>Quản lý người dùng</span>
          </Link>
          <Link to="/admin" className="action-card" state={{ tab: 'declarations' }}>
            <span className="action-icon">📝</span>
            <span>Quản lý tờ khai</span>
          </Link>
          <Link to="/admin" className="action-card" state={{ tab: 'config' }}>
            <span className="action-icon">⚙️</span>
            <span>Cấu hình biểu thuế</span>
          </Link>
        </div>
      </div>

      {/* ─── Biểu đồ ─────────────────────────────────── */}
      {chartData.length > 0 && (
        <div className="dash-chart-grid">
          <div className="dash-chart-card">
            <h3 className="dash-chart-title">📈 Doanh thu thuế theo năm</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f6" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000000}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Doanh thu thuế']} labelFormatter={l => `Năm ${l}`} />
                  <Area type="monotone" dataKey="Thuế đã thu" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dash-chart-card">
            <h3 className="dash-chart-title">📊 Số lượng tờ khai theo năm</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f6" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="Số tờ khai" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bảng người dùng + tờ khai gần đây ─────── */}
      <div className="dash-recent-grid">
        {/* Người dùng mới */}
        <div className="dash-recent-card">
          <div className="dash-recent-header">
            <h3>👥 Người dùng đăng ký gần đây</h3>
            <Link to="/admin" className="dash-view-all">Xem tất cả →</Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="dash-empty">Chưa có người dùng nào.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table dash-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>CCCD</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.fullName}</td>
                      <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{u.email}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{u.idNumber || '—'}</td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{formatDate(u.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${u.isActive ? 'paid' : 'overdue'}`}>
                          {u.isActive ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tờ khai gần đây */}
        <div className="dash-recent-card">
          <div className="dash-recent-header">
            <h3>📝 Tờ khai gần đây</h3>
            <Link to="/admin" className="dash-view-all">Xem tất cả →</Link>
          </div>
          {recentDeclarations.length === 0 ? (
            <p className="dash-empty">Chưa có tờ khai nào.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table dash-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Người nộp</th>
                    <th>Kỳ thuế</th>
                    <th>Thuế phải nộp</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeclarations.map(d => {
                    const st = statusMap[d.status] || { label: d.status, cls: '' };
                    return (
                      <tr key={d._id}>
                        <td style={{ fontWeight: 650, color: 'var(--secondary)', fontFamily: 'monospace' }}>
                          #{d._id?.slice(-6).toUpperCase()}
                        </td>
                        <td style={{ fontWeight: 500 }}>{d.user?.fullName || 'N/A'}</td>
                        <td>{d.declarationType === 'annual' ? `Năm ${d.year}` : `T${d.month}/${d.year}`}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(d.taxAmount)}</td>
                        <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*   USER DASHBOARD                                           */
/* ═══════════════════════════════════════════════════════════ */
function UserDashboard() {
  const { user } = useAuth();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxService.getDeclarations()
      .then(d => setDeclarations(d?.data || []))
      .catch((err) => {
        console.error('Lỗi tải khai báo:', err?.message || err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner variant="dashboard" message="Đang tải tổng quan..." />;

  const totalTax = declarations.filter(d => d.status === 'paid').reduce((s, d) => s + (d.taxAmount || 0), 0);
  const paidCount = declarations.filter(d => d.status === 'paid').length;
  const pendingCount = declarations.filter(d => d.status === 'pending' || d.status === 'overdue').length;

  // 5 tờ khai gần nhất
  const recentDeclarations = [...declarations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusMap = {
    draft: { label: 'Nháp', cls: 'draft' },
    pending: { label: 'Chờ nộp', cls: 'draft' },
    submitted: { label: 'Đã gửi', cls: 'submitted' },
    paid: { label: 'Đã nộp thuế', cls: 'paid' },
    overdue: { label: 'Quá hạn', cls: 'overdue' },
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🏠 Tổng quan</h1>
      <p className="dash-welcome">
        Xin chào, <strong>{user?.fullName}</strong>! Đây là tổng quan tài khoản thuế TNCN của bạn.
      </p>

      {/* Stat Cards */}
      <div className="stats-grid stats-grid-4">
        <div className="stat-card stat-blue">
          <div className="stat-icon-circle blue">📋</div>
          <div>
            <p className="stat-label">Tổng khai báo</p>
            <p className="stat-value">{declarations.length}</p>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon-circle green">✅</div>
          <div>
            <p className="stat-label">Đã nộp thuế</p>
            <p className="stat-value">{paidCount}</p>
          </div>
        </div>
        <div className="stat-card stat-amber">
          <div className="stat-icon-circle amber">⏳</div>
          <div>
            <p className="stat-label">Chờ xử lý</p>
            <p className="stat-value">{pendingCount}</p>
          </div>
        </div>
        <div className="stat-card stat-violet">
          <div className="stat-icon-circle violet">💰</div>
          <div>
            <p className="stat-label">Tổng thuế đã nộp</p>
            <p className="stat-value">{formatCurrency(totalTax)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
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

      {/* Tờ khai gần đây */}
      {recentDeclarations.length > 0 && (
        <div className="dash-recent-card" style={{ marginTop: '0.5rem' }}>
          <div className="dash-recent-header">
            <h3>📝 Tờ khai gần đây</h3>
            <Link to="/tax/history" className="dash-view-all">Xem tất cả →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table dash-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Kỳ thuế</th>
                  <th>Thu nhập</th>
                  <th>Thuế phải nộp</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentDeclarations.map(d => {
                  const st = statusMap[d.status] || { label: d.status, cls: '' };
                  return (
                    <tr key={d._id}>
                      <td style={{ fontWeight: 650, color: 'var(--secondary)', fontFamily: 'monospace' }}>
                        #{d._id?.slice(-6).toUpperCase()}
                      </td>
                      <td>{d.declarationType === 'annual' ? `Năm ${d.year}` : `Tháng ${d.month}/${d.year}`}</td>
                      <td>{formatCurrency(d.totalIncome)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(d.taxAmount)}</td>
                      <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Thông tin biểu thuế */}
      <div className="dash-info-card">
        <h3>📌 Thông tin biểu thuế TNCN năm 2025</h3>
        <ul>
          <li>Giảm trừ bản thân: <strong>11.000.000 đồng/tháng</strong></li>
          <li>Giảm trừ người phụ thuộc: <strong>4.400.000 đồng/tháng/người</strong></li>
          <li>Thuế suất từ <strong>5%</strong> đến <strong>35%</strong> theo 7 bậc lũy tiến</li>
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*   MAIN EXPORT - Hiển thị đúng dashboard theo vai trò       */
/* ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
}
