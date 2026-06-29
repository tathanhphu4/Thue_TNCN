import React from 'react';

const PERSONAL_DEDUCTION  = 11000000;
const DEPENDENT_DEDUCTION =  4400000;
const INSURANCE_RATE      = 0.105;

const DeductionForm = ({ deductions, onChange, totalIncome }) => {
  const dep = deductions.find(d => d.type === 'dependent') || { type: 'dependent', dependents: 0, amount: 0 };
  const charity = deductions.find(d => d.type === 'charity') || { type: 'charity', amount: '', description: '' };
  const insurance = deductions.find(d => d.type === 'insurance') || { type: 'insurance', amount: '', description: '' };
  const other = deductions.find(d => d.type === 'other') || { type: 'other', amount: '', description: '' };

  const autoInsurance = totalIncome ? Math.round(totalIncome * INSURANCE_RATE) : 0;

  const updateDeduction = (type, fields) => {
    const exists = deductions.find(d => d.type === type);
    if (exists) {
      onChange(deductions.map(d => d.type === type ? { ...d, ...fields } : d));
    } else {
      onChange([...deductions, { type, amount: 0, description: '', dependents: 0, ...fields }]);
    }
  };

  const setDependents = (val) => {
    const n = Math.max(0, Math.min(9, Number(val) || 0));
    updateDeduction('dependent', { dependents: n, amount: n * DEPENDENT_DEDUCTION });
  };

  return (
    <div className="declare-section">
      <div className="declare-section-header">
        <h3>📋 Các khoản giảm trừ</h3>
      </div>

      {/* Giảm trừ bản thân - cố định */}
      <div className="deduction-row deduction-row--fixed">
        <div className="deduction-info">
          <span className="deduction-name">👤 Giảm trừ bản thân</span>
          <span className="deduction-note">Cố định theo quy định</span>
        </div>
        <span className="deduction-amount">
          {PERSONAL_DEDUCTION.toLocaleString('vi-VN')}đ/tháng
        </span>
      </div>

      {/* Bảo hiểm */}
      <div className="deduction-row">
        <div className="deduction-info">
          <span className="deduction-name">🛡️ Bảo hiểm bắt buộc (10.5%)</span>
          <span className="deduction-note">BHXH 8% + BHYT 1.5% + BHTN 1%</span>
        </div>
        <div className="deduction-input-group">
          {autoInsurance > 0 && (
            <button
              type="button"
              className="btn-autofill"
              onClick={() => updateDeduction('insurance', { amount: String(autoInsurance), description: 'BHXH+BHYT+BHTN' })}
            >
              Tự động ({autoInsurance.toLocaleString('vi-VN')}đ)
            </button>
          )}
          <div className="input-currency input-currency--sm">
            <input
              type="text"
              inputMode="numeric"
              className="form-input"
              placeholder="Nhập hoặc tự động"
              value={insurance.amount}
              onChange={e => {
                if (/^\d*$/.test(e.target.value))
                  updateDeduction('insurance', { amount: e.target.value });
              }}
            />
            <span className="currency-unit">đ</span>
          </div>
        </div>
      </div>

      {/* Người phụ thuộc */}
      <div className="deduction-row">
        <div className="deduction-info">
          <span className="deduction-name">👨‍👩‍👧 Người phụ thuộc</span>
          <span className="deduction-note">
            {DEPENDENT_DEDUCTION.toLocaleString('vi-VN')}đ/người/tháng
          </span>
        </div>
        <div className="deduction-dep-group">
          <div className="dependents-input">
            <button type="button" className="dep-btn"
              onClick={() => setDependents(dep.dependents - 1)}
              disabled={dep.dependents <= 0}>−</button>
            <input
              type="text" inputMode="numeric"
              className="form-input dep-input"
              value={dep.dependents}
              onChange={e => setDependents(e.target.value)}
            />
            <button type="button" className="dep-btn"
              onClick={() => setDependents(dep.dependents + 1)}
              disabled={dep.dependents >= 9}>+</button>
          </div>
          {dep.dependents > 0 && (
            <span className="dep-total">
              = {(dep.dependents * DEPENDENT_DEDUCTION).toLocaleString('vi-VN')}đ/tháng
            </span>
          )}
        </div>
      </div>

      {/* Từ thiện */}
      <div className="deduction-row">
        <div className="deduction-info">
          <span className="deduction-name">❤️ Đóng góp từ thiện</span>
          <span className="deduction-note">Quỹ từ thiện được công nhận</span>
        </div>
        <div className="input-currency input-currency--sm">
          <input
            type="text" inputMode="numeric"
            className="form-input"
            placeholder="0"
            value={charity.amount}
            onChange={e => {
              if (/^\d*$/.test(e.target.value))
                updateDeduction('charity', { amount: e.target.value });
            }}
          />
          <span className="currency-unit">đ</span>
        </div>
      </div>

      {/* Khác */}
      <div className="deduction-row">
        <div className="deduction-info">
          <span className="deduction-name">📦 Giảm trừ khác</span>
          <input
            type="text"
            className="form-input form-input--sm"
            placeholder="Ghi chú (không bắt buộc)"
            value={other.description}
            onChange={e => updateDeduction('other', { description: e.target.value })}
          />
        </div>
        <div className="input-currency input-currency--sm">
          <input
            type="text" inputMode="numeric"
            className="form-input"
            placeholder="0"
            value={other.amount}
            onChange={e => {
              if (/^\d*$/.test(e.target.value))
                updateDeduction('other', { amount: e.target.value });
            }}
          />
          <span className="currency-unit">đ</span>
        </div>
      </div>
    </div>
  );
};

export default DeductionForm;