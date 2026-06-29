import React from 'react';

const fmt = (n) => (Number(n) || 0).toLocaleString('vi-VN') + 'đ';

const INCOME_LABELS = {
  salary: 'Tiền lương / tiền công',
  business: 'Kinh doanh',
  investment: 'Đầu tư / chứng khoán',
  other: 'Khác',
};

const DEDUCTION_LABELS = {
  personal: 'Giảm trừ bản thân',
  dependent: 'Giảm trừ người phụ thuộc',
  insurance: 'Bảo hiểm bắt buộc',
  charity: 'Đóng góp từ thiện',
  other: 'Giảm trừ khác',
};

const Row = ({ label, value, bold, highlight }) => (
  <div className={`preview-row${bold ? ' preview-row--bold' : ''}${highlight ? ' preview-row--highlight' : ''}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const TaxPreview = ({ data, onConfirm, onBack, loading }) => {
  const { year, month, declarationType, incomes, deductions, computed } = data;

  return (
    <div className="preview-card">
      <div className="preview-card__header">
        <h3>👁️ Xem trước khai báo thuế</h3>
        <p>Kiểm tra thông tin trước khi gửi</p>
      </div>

      <div className="preview-card__body">
        {/* Thông tin kỳ khai báo */}
        <div className="preview-section">
          <p className="preview-section-title">Kỳ khai báo</p>
          <Row label="Loại khai báo" value={declarationType === 'monthly' ? '📅 Theo tháng' : '📆 Theo năm'} />
          <Row label="Năm" value={year} />
          {declarationType === 'monthly' && month && (
            <Row label="Tháng" value={`Tháng ${month}`} />
          )}
        </div>

        {/* Thu nhập */}
        <div className="preview-section">
          <p className="preview-section-title">Nguồn thu nhập</p>
          {incomes.map((inc, i) => (
            <Row
              key={i}
              label={`${INCOME_LABELS[inc.source] || inc.source}${inc.description ? ` (${inc.description})` : ''}`}
              value={fmt(inc.amount)}
            />
          ))}
          <Row label="Tổng thu nhập" value={fmt(computed.totalIncome)} bold />
        </div>

        {/* Giảm trừ */}
        <div className="preview-section">
          <p className="preview-section-title">Các khoản giảm trừ</p>
          <Row label="Giảm trừ bản thân" value={fmt(computed.personalDeduction)} />
          {deductions.map((ded, i) => {
            if (!ded.amount && ded.type !== 'dependent') return null;
            if (ded.type === 'dependent' && !ded.dependents) return null;
            return (
              <Row
                key={i}
                label={`${DEDUCTION_LABELS[ded.type] || ded.type}${ded.dependents ? ` (${ded.dependents} người)` : ''}`}
                value={fmt(ded.amount)}
              />
            );
          })}
          <Row label="Tổng giảm trừ" value={fmt(computed.totalDeduction)} bold />
        </div>

        {/* Kết quả thuế */}
        <div className="preview-section preview-section--result">
          <p className="preview-section-title">Kết quả tính thuế</p>
          <Row label="Thu nhập tính thuế" value={fmt(computed.taxableIncome)} bold />
          <Row label="Thuế TNCN phải nộp" value={fmt(computed.taxAmount)} highlight bold />
          <Row label="Thu nhập thực nhận (NET)" value={fmt(computed.netIncome)} bold />
        </div>
      </div>

      <div className="preview-card__footer">
        <button type="button" className="btn btn-outline" onClick={onBack} disabled={loading}>
          ← Quay lại chỉnh sửa
        </button>
        <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={loading}>
          {loading ? <><span className="spinner" /> Đang gửi...</> : '✅ Xác nhận & Gửi khai báo'}
        </button>
      </div>
    </div>
  );
};

export default TaxPreview;