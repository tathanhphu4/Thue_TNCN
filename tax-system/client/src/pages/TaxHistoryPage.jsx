import { useState, useEffect, useCallback } from "react";
import PaymentModal from "../components/tax/PaymentModal";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorMessage from "../components/shared/ErrorMessage";
import EmptyState from "../components/shared/EmptyState";
import { formatCurrency, formatDate } from "../utils/formatters";
import "../styles/taxHistory.css";

const STATUS_CONFIG = {
  draft:    { label: "Nháp",        className: "status-draft",    icon: "📝" },
  pending:  { label: "Chờ nộp",     className: "status-pending",  icon: "⏳" },
  paid:     { label: "Đã nộp",      className: "status-paid",     icon: "✅" },
  overdue:  { label: "Quá hạn",     className: "status-overdue",  icon: "🚨" },
  rejected: { label: "Bị từ chối",  className: "status-rejected", icon: "❌" },
};

const FILTER_OPTIONS = [
  { value: "all",     label: "Tất cả" },
  { value: "pending", label: "Chờ nộp" },
  { value: "paid",    label: "Đã nộp" },
  { value: "draft",   label: "Nháp" },
  { value: "overdue", label: "Quá hạn" },
];

export default function TaxHistoryPage() {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchDeclarations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tax/declarations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể tải lịch sử.");
      setDeclarations(data.declarations || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeclarations();
  }, [fetchDeclarations]);

  const handlePayClick = (decl) => {
    setSelectedDeclaration(decl);
    setShowModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchDeclarations(); // reload list
  };

  // Years available
  const years = [...new Set(declarations.map((d) => d.year))].sort((a, b) => b - a);

  // Filter
  const filtered = declarations.filter((d) => {
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    const matchYear = filterYear === "all" || String(d.year) === filterYear;
    return matchStatus && matchYear;
  });

  // Stats
  const totalTax = declarations
    .filter((d) => d.status === "paid")
    .reduce((sum, d) => sum + (d.taxAmount || 0), 0);
  const pendingCount = declarations.filter((d) => d.status === "pending" || d.status === "overdue").length;

  if (loading) return <LoadingSpinner variant="card" message="Đang tải lịch sử khai báo..." />;

  return (
    <div className="tax-history-page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>Lịch sử khai báo thuế</h1>
          <p>Quản lý và theo dõi các kỳ khai báo thuế TNCN của bạn</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDeclarations} />}

      {/* Summary cards */}
      <div className="history-stats">
        <div className="hist-stat-card">
          <span className="hist-stat-icon">📋</span>
          <div>
            <strong>{declarations.length}</strong>
            <span>Tổng khai báo</span>
          </div>
        </div>
        <div className="hist-stat-card">
          <span className="hist-stat-icon">✅</span>
          <div>
            <strong>{declarations.filter((d) => d.status === "paid").length}</strong>
            <span>Đã hoàn thành</span>
          </div>
        </div>
        <div className="hist-stat-card warn">
          <span className="hist-stat-icon">⏳</span>
          <div>
            <strong>{pendingCount}</strong>
            <span>Cần nộp thuế</span>
          </div>
        </div>
        <div className="hist-stat-card success">
          <span className="hist-stat-icon">💰</span>
          <div>
            <strong>{formatCurrency(totalTax)}</strong>
            <span>Tổng đã nộp</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <div className="filter-tabs">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`filter-tab ${filterStatus === opt.value ? "active" : ""}`}
                onClick={() => setFilterStatus(opt.value)}
              >
                {opt.label}
                {opt.value !== "all" && (
                  <span className="filter-count">
                    {declarations.filter((d) => d.status === opt.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Năm:</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả năm</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                Năm {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Không tìm thấy tờ khai thuế"
          message={
            filterStatus === "all" && filterYear === "all"
              ? "Bạn chưa thực hiện khai báo thuế nào trong hệ thống."
              : "Không tìm thấy tờ khai thuế nào khớp với bộ lọc của bạn."
          }
          action={
            filterStatus === "all" && filterYear === "all"
              ? { label: "+ Tạo khai báo mới", onClick: () => window.location.href = "/tax/declare" }
              : null
          }
        />
      ) : (
        <div className="declaration-list">
          {filtered.map((decl) => {
            const statusCfg = STATUS_CONFIG[decl.status] || STATUS_CONFIG.draft;
            const isExpanded = expandedId === decl._id;
            const canPay = decl.status === "pending" || decl.status === "overdue";

            return (
              <div key={decl._id} className={`decl-card ${canPay ? "can-pay" : ""}`}>
                {/* Card main row */}
                <div className="decl-main" onClick={() => setExpandedId(isExpanded ? null : decl._id)}>
                  <div className="decl-left">
                    <div className="decl-id">
                      <span className="decl-year">Năm {decl.year}</span>
                      <span className="decl-code">#{decl._id?.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="decl-meta">
                      <span>Khai báo ngày {formatDate(decl.createdAt)}</span>
                      {decl.declarationType && (
                        <span className="decl-type">{decl.declarationType}</span>
                      )}
                    </div>
                  </div>

                  <div className="decl-right">
                    <div className="decl-amounts">
                      <div className="decl-income">
                        Thu nhập: <strong>{formatCurrency(decl.totalIncome || 0)}</strong>
                      </div>
                      <div className="decl-tax">
                        Tiền thuế:{" "}
                        <strong className={canPay ? "tax-due" : ""}>
                          {formatCurrency(decl.taxAmount || 0)}
                        </strong>
                      </div>
                    </div>

                    <div className="decl-status-actions">
                      <span className={`status-badge ${statusCfg.className}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>

                      {canPay && (
                        <button
                          className="btn-pay-now"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePayClick(decl);
                          }}
                        >
                          Nộp thuế ngay
                        </button>
                      )}

                      <button className="btn-expand">
                        {isExpanded ? "▲" : "▼"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="decl-detail">
                    <div className="detail-grid">
                      <div className="detail-section">
                        <h4>Thu nhập</h4>
                        {decl.incomes?.length > 0 ? (
                          decl.incomes.map((inc, i) => (
                            <div key={i} className="detail-row">
                              <span>{inc.source || `Nguồn ${i + 1}`}</span>
                              <span>{formatCurrency(inc.amount || 0)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="no-data">Không có dữ liệu</p>
                        )}
                      </div>

                      <div className="detail-section">
                        <h4>Giảm trừ</h4>
                        <div className="detail-row">
                          <span>Bản thân</span>
                          <span>{formatCurrency(decl.deductions?.personal || 11000000)}</span>
                        </div>
                        {decl.deductions?.dependents > 0 && (
                          <div className="detail-row">
                            <span>Người phụ thuộc ({decl.deductions?.numDependents || 0} người)</span>
                            <span>{formatCurrency(decl.deductions?.dependents || 0)}</span>
                          </div>
                        )}
                        {decl.deductions?.insurance > 0 && (
                          <div className="detail-row">
                            <span>Bảo hiểm</span>
                            <span>{formatCurrency(decl.deductions?.insurance || 0)}</span>
                          </div>
                        )}
                        <div className="detail-row total-row">
                          <span>Tổng giảm trừ</span>
                          <span>{formatCurrency(decl.totalDeductions || 0)}</span>
                        </div>
                      </div>

                      <div className="detail-section">
                        <h4>Kết quả tính thuế</h4>
                        <div className="detail-row">
                          <span>Thu nhập chịu thuế</span>
                          <span>{formatCurrency(decl.taxableIncome || 0)}</span>
                        </div>
                        <div className="detail-row bold-row">
                          <span>Thuế TNCN phải nộp</span>
                          <span className={canPay ? "tax-due" : "tax-done"}>
                            {formatCurrency(decl.taxAmount || 0)}
                          </span>
                        </div>
                        {decl.paidAt && (
                          <div className="detail-row">
                            <span>Ngày nộp</span>
                            <span>{formatDate(decl.paidAt)}</span>
                          </div>
                        )}
                        {decl.paymentMethod && (
                          <div className="detail-row">
                            <span>Phương thức</span>
                            <span>{decl.paymentMethod}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {canPay && (
                      <div className="detail-cta">
                        <button className="btn-pay-large" onClick={() => handlePayClick(decl)}>
                          💳 Nộp thuế {formatCurrency(decl.taxAmount || 0)}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {showModal && selectedDeclaration && (
        <PaymentModal
          declaration={selectedDeclaration}
          onClose={() => {
            setShowModal(false);
            setSelectedDeclaration(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}