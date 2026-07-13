import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taxService } from '../services/taxService';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getStatusConfig } from '../utils/statusConfig';
import { downloadAuthenticatedFile } from '../utils/fileDownload';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import '../styles/dashboard.css';

export default function ReportPage() {
  const { user } = useAuth();
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taxService.getDeclarations();
      setDeclarations(data?.data || data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const downloadPDF = async (declId) => {
    setDownloadingId(declId);
    try {
      await downloadAuthenticatedFile(
        `/api/reports/export/pdf/${declId}`,
        `chung_nhan_thue_${declId.slice(-6).toUpperCase()}.pdf`
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải dữ liệu báo cáo..." />;

  // 1. Years list
  const years = [...new Set(declarations.map(d => d.year))].sort((a, b) => b - a);

  // 2. Aggregate data for Charts
  const chartDataMap = {};
  declarations.forEach(d => {
    if (!chartDataMap[d.year]) {
      chartDataMap[d.year] = { year: String(d.year), "Tổng thu nhập": 0, "Thuế phải nộp": 0, "Thuế đã nộp": 0 };
    }
    chartDataMap[d.year]["Tổng thu nhập"] += d.totalIncome || 0;
    chartDataMap[d.year]["Thuế phải nộp"] += d.taxAmount || 0;
    if (d.status === 'paid') {
      chartDataMap[d.year]["Thuế đã nộp"] += d.taxAmount || 0;
    }
  });

  const chartData = Object.values(chartDataMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // 3. Stats summary
  const totalIncome = declarations.reduce((sum, d) => sum + (d.totalIncome || 0), 0);
  const totalTaxPayable = declarations.reduce((sum, d) => sum + (d.taxAmount || 0), 0);
  const totalTaxPaid = declarations.filter(d => d.status === 'paid').reduce((sum, d) => sum + (d.taxAmount || 0), 0);
  const pendingTax = declarations.filter(d => d.status === 'pending' || d.status === 'overdue').reduce((sum, d) => sum + (d.taxAmount || 0), 0);

  // 4. Filter declarations for Table
  const filteredDeclarations = declarations.filter(d => {
    return selectedYear === 'all' || String(d.year) === selectedYear;
  });

  return (
    <div className="page-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <h1 className="page-title">📊 Báo cáo thuế cá nhân</h1>

      {error && <ErrorMessage message={error} onRetry={fetchReports} />}

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ borderLeftColor: '#3498db' }}>
          <p className="stat-label">Tổng thu nhập khai báo</p>
          <p className="stat-value">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#e74c3c' }}>
          <p className="stat-label">Tổng thuế phát sinh</p>
          <p className="stat-value" style={{ color: 'var(--text)' }}>{formatCurrency(totalTaxPayable)}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#2ecc71' }}>
          <p className="stat-label">Tổng số thuế đã nộp</p>
          <p className="stat-value" style={{ color: '#2ecc71' }}>{formatCurrency(totalTaxPaid)}</p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f1c40f' }}>
          <p className="stat-label">Thuế cần nộp còn lại</p>
          <p className="stat-value" style={{ color: '#f39c12' }}>{formatCurrency(pendingTax)}</p>
        </div>
      </div>

      {/* Visualizations Section */}
      {chartData.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Chart 1: Income */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid #eef2f5' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700 }}>
              📈 Biểu đồ Thu nhập theo năm
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3498db" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f6" />
                  <XAxis dataKey="year" stroke="#7f8c8d" fontSize={12} tickLine={false} />
                  <YAxis stroke="#7f8c8d" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Tổng thu nhập"]} labelFormatter={(label) => `Năm ${label}`} />
                  <Area type="monotone" dataKey="Tổng thu nhập" stroke="#3498db" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Tax amount */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid #eef2f5' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700 }}>
              📊 Biểu đồ Thuế đã nộp & thuế phải nộp
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f6" />
                  <XAxis dataKey="year" stroke="#7f8c8d" fontSize={12} tickLine={false} />
                  <YAxis stroke="#7f8c8d" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                  <Tooltip formatter={(value, name) => [formatCurrency(value), name]} labelFormatter={(label) => `Năm ${label}`} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="Thuế phải nộp" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={25} />
                  <Bar dataKey="Thuế đã nộp" fill="#2ecc71" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', color: '#888', boxShadow: 'var(--shadow)', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
          <p>Chưa đủ số liệu để hiển thị biểu đồ.</p>
        </div>
      )}

      {/* Table Section */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--shadow)', border: '1px solid #eef2f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)', fontWeight: 700 }}>
            📝 Danh sách tờ khai chi tiết
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Năm tính thuế:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1.5px solid var(--border)', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="all">Tất cả năm</option>
              {years.map(y => (
                <option key={y} value={String(y)}>Năm {y}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredDeclarations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            Không có tờ khai nào phù hợp.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã tờ khai</th>
                  <th>Năm</th>
                  <th>Kỳ khai báo</th>
                  <th>Tổng thu nhập</th>
                  <th>Giảm trừ gia cảnh</th>
                  <th>Thuế phải nộp</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeclarations.map(decl => {
                  const statusCfg = getStatusConfig(decl.status);

                  return (
                    <tr key={decl._id}>
                      <td style={{ fontWeight: 650, color: 'var(--primary)' }}>
                        #{decl._id?.slice(-6).toUpperCase()}
                      </td>
                      <td>{decl.year}</td>
                      <td>
                        {decl.declarationType === 'annual' ? 'Cả năm' : `Tháng ${decl.month}`}
                      </td>
                      <td>{formatCurrency(decl.totalIncome)}</td>
                      <td>{formatCurrency(decl.totalDeduction)}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(decl.taxAmount)}</td>
                      <td>
                        <span className={`status-badge ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => downloadPDF(decl._id)}
                          disabled={downloadingId === decl._id}
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            background: '#34495e',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = '0.9'}
                          onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                          {downloadingId === decl._id ? '⏳ Đang tải...' : '📥 Tải PDF'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
