import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const Row = ({ label, value, highlight, bold }) => (
  <div className={`result-row${highlight ? ' result-row--highlight' : ''}${bold ? ' result-row--bold' : ''}`}>
    <span className="result-label">{label}</span>
    <span className="result-value">{formatCurrency(value)}</span>
  </div>
);

const TaxResultCard = ({ result }) => {
  if (!result) return null;

  const {
    grossIncome,
    insurance,
    personalDeduction,
    dependentDeduction,
    otherDeduction,
    taxableIncome,
    taxAmount,
    netIncome,
    bracketDetails = [],
  } = result;

  return (
    <div className="result-card">
      <div className="result-card__header">
        <h3>📊 Kết quả tính thuế</h3>
      </div>

      <div className="result-card__body">
        {/* Thu nhập & khấu trừ */}
        <div className="result-section">
          <p className="result-section-title">Thu nhập & Khấu trừ</p>
          <Row label="Thu nhập tháng" value={grossIncome} />
          <Row label="Bảo hiểm (10.5%)" value={insurance} />
          <Row label="Giảm trừ bản thân" value={personalDeduction} />
          <Row label="Giảm trừ người phụ thuộc" value={dependentDeduction} />
          {otherDeduction > 0 && (
            <Row label="Giảm trừ khác" value={otherDeduction} />
          )}
          <Row label="Thu nhập tính thuế" value={taxableIncome} bold />
        </div>

        {/* Chi tiết từng bậc */}
        {bracketDetails.length > 0 && (
          <div className="result-section">
            <p className="result-section-title">Chi tiết từng bậc thuế</p>
            {bracketDetails.map((b, i) => (
              <div key={i} className="bracket-detail-row">
                <span className="bracket-detail-label">
                  Bậc {b.level} ({b.rate}%)
                  <span className="bracket-detail-range">
                    &nbsp;· {formatCurrency(b.taxableInBracket)}
                  </span>
                </span>
                <span className="bracket-detail-tax">
                  {formatCurrency(b.taxInBracket)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tổng kết */}
        <div className="result-section result-section--summary">
          <Row label="Thuế TNCN phải nộp" value={taxAmount} highlight bold />
          <Row label="Thu nhập thực nhận (NET)" value={netIncome} bold />
        </div>

        {/* Tỷ lệ thuế hiệu dụng */}
        {grossIncome > 0 && (
          <p className="effective-rate">
            Tỷ lệ thuế hiệu dụng:{' '}
            <strong>{((taxAmount / grossIncome) * 100).toFixed(2)}%</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default TaxResultCard;