import React from 'react';

const INCOME_SOURCES = [
  { value: 'salary',     label: '💼 Tiền lương / tiền công' },
  { value: 'business',   label: '🏪 Kinh doanh' },
  { value: 'investment', label: '📈 Đầu tư / chứng khoán' },
  { value: 'other',      label: '📦 Khác' },
];

const emptyIncome = () => ({ id: Date.now(), source: 'salary', description: '', amount: '' });

const IncomeForm = ({ incomes, onChange }) => {
  const handleAdd = () => onChange([...incomes, emptyIncome()]);

  const handleRemove = (id) => onChange(incomes.filter(i => i.id !== id));

  const handleChange = (id, field, value) => {
    onChange(incomes.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="declare-section">
      <div className="declare-section-header">
        <h3>💰 Nguồn thu nhập</h3>
        <button type="button" className="btn-add" onClick={handleAdd}>
          + Thêm nguồn
        </button>
      </div>

      {incomes.length === 0 && (
        <p className="empty-hint">Chưa có nguồn thu nhập nào. Nhấn <strong>+ Thêm nguồn</strong>.</p>
      )}

      {incomes.map((income, idx) => (
        <div key={income.id} className="income-row">
          <div className="income-row__index">{idx + 1}</div>
          <div className="income-row__fields">
            <div className="form-row-3">
              {/* Loại thu nhập */}
              <div className="form-group">
                <label className="form-label">Loại thu nhập</label>
                <select
                  className="form-input"
                  value={income.source}
                  onChange={e => handleChange(income.id, 'source', e.target.value)}
                >
                  {INCOME_SOURCES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Mô tả */}
              <div className="form-group">
                <label className="form-label">Mô tả (không bắt buộc)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="VD: Công ty ABC"
                  value={income.description}
                  onChange={e => handleChange(income.id, 'description', e.target.value)}
                />
              </div>

              {/* Số tiền */}
              <div className="form-group">
                <label className="form-label">Số tiền (đồng) <span className="required">*</span></label>
                <div className="input-currency">
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`form-input${!income.amount && income.amount !== '' ? '' : ''}`}
                    placeholder="VD: 20000000"
                    value={income.amount}
                    onChange={e => {
                      if (/^\d*$/.test(e.target.value))
                        handleChange(income.id, 'amount', e.target.value);
                    }}
                  />
                  <span className="currency-unit">đ</span>
                </div>
                {income.amount && (
                  <p className="input-hint">
                    = {Number(income.amount).toLocaleString('vi-VN')}đ
                  </p>
                )}
              </div>
            </div>
          </div>

          {incomes.length > 1 && (
            <button
              type="button"
              className="btn-remove"
              onClick={() => handleRemove(income.id)}
              title="Xóa nguồn thu nhập này"
            >×</button>
          )}
        </div>
      ))}

      {incomes.length > 0 && (
        <div className="income-total">
          <span>Tổng thu nhập:</span>
          <strong>
            {incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0)
              .toLocaleString('vi-VN')}đ
          </strong>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;