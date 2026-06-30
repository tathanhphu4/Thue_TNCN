import React, { useState } from 'react';
import { taxService } from '../services/taxService';
import TaxBracketTable from '../components/tax/TaxBracketTable';
import TaxResultCard from '../components/tax/TaxResultCard';
import { calculateTax } from '../utils/taxConstants';
import '../styles/calculator.css';

const initialForm = {
  grossIncome:    '',
  dependents:     '0',
  otherDeduction: '',
};

const TaxCalculatorPage = () => {
  const [form, setForm]       = useState(initialForm);
  const [result, setResult]   = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chỉ cho nhập số
    if (name !== 'dependents' && value && !/^\d*$/.test(value)) return;
    if (name === 'dependents' && value && !/^\d$/.test(value)) return;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.grossIncome || Number(form.grossIncome) <= 0)
      errs.grossIncome = 'Vui lòng nhập thu nhập hợp lệ';
    if (Number(form.grossIncome) > 1000000000)
      errs.grossIncome = 'Thu nhập không được vượt quá 1 tỷ đồng/tháng';
    return errs;
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Tính offline ngay lập tức
      const res = calculateTax({
        grossIncome:    Number(form.grossIncome),
        dependents:     Number(form.dependents) || 0,
        otherDeduction: Number(form.otherDeduction) || 0,
      });
      setResult(res);

      // Gọi API backend để lưu lịch sử (không block UI)
      taxService.calculate({
        grossIncome:    Number(form.grossIncome),
        dependents:     Number(form.dependents) || 0,
        otherDeduction: Number(form.otherDeduction) || 0,
      }).catch(() => {}); // Bỏ qua lỗi API, vẫn hiển thị kết quả

    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="calc-page">
      <div className="calc-header">
        <h1 className="calc-title">🧮 Máy tính thuế TNCN</h1>
        <p className="calc-subtitle">
          Tính thuế thu nhập cá nhân theo biểu thuế lũy tiến Việt Nam 2026
          
        </p>
      </div>

      <div className="calc-layout">
        {/* Cột trái: Form nhập */}
        <div className="calc-left">
          <div className="calc-form-card">
            <h2 className="calc-form-title">Thông tin thu nhập</h2>
            <form onSubmit={handleCalculate} noValidate>

              {/* Thu nhập tháng */}
              <div className="form-group">
                <label className="form-label" htmlFor="grossIncome">
                  Thu nhập tháng (đồng/tháng) <span className="required">*</span>
                </label>
                <div className="input-currency">
                  <input
                    id="grossIncome"
                    name="grossIncome"
                    type="text"
                    inputMode="numeric"
                    className={`form-input${errors.grossIncome ? ' input-error' : ''}`}
                    placeholder="VD: 20000000"
                    value={form.grossIncome}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="currency-unit">đ</span>
                </div>
                {form.grossIncome && (
                  <p className="input-hint">
                    ≈ {Number(form.grossIncome).toLocaleString('vi-VN')} đồng
                  </p>
                )}
                {errors.grossIncome && (
                  <p className="error-text">⚠ {errors.grossIncome}</p>
                )}
              </div>

              {/* Số người phụ thuộc */}
              <div className="form-group">
                <label className="form-label" htmlFor="dependents">
                  Số người phụ thuộc
                </label>
                <div className="dependents-input">
                  <button
                    type="button"
                    className="dep-btn"
                    onClick={() => setForm(p => ({ ...p, dependents: String(Math.max(0, Number(p.dependents) - 1)) }))}
                    disabled={Number(form.dependents) <= 0 || loading}
                  >−</button>
                  <input
                    id="dependents"
                    name="dependents"
                    type="text"
                    inputMode="numeric"
                    className="form-input dep-input"
                    value={form.dependents}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="dep-btn"
                    onClick={() => setForm(p => ({ ...p, dependents: String(Math.min(9, Number(p.dependents) + 1)) }))}
                    disabled={Number(form.dependents) >= 9 || loading}
                  >+</button>
                </div>
                <p className="input-hint">
                  Giảm trừ: {Number(form.dependents || 0) * 4400000 .toLocaleString('vi-VN')}đ/tháng
                </p>
              </div>

              {/* Giảm trừ khác */}
              <div className="form-group">
                <label className="form-label" htmlFor="otherDeduction">
                  Giảm trừ khác (đồng/tháng)
                </label>
                <div className="input-currency">
                  <input
                    id="otherDeduction"
                    name="otherDeduction"
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    placeholder="Từ thiện, bảo hiểm nhân thọ..."
                    value={form.otherDeduction}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="currency-unit">đ</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="calc-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <><span className="spinner" /> Đang tính...</> : '⚡ Tính thuế ngay'}
                </button>
                {result && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleReset}
                  >
                    🔄 Nhập lại
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Bảng biểu thuế */}
          <TaxBracketTable activeBrackets={result?.activeBrackets || []} />
        </div>

        {/* Cột phải: Kết quả */}
        <div className="calc-right">
          {!result ? (
            <div className="calc-empty">
              <div className="calc-empty-icon">📋</div>
              <p>Nhập thông tin thu nhập và nhấn <strong>Tính thuế ngay</strong> để xem kết quả</p>
            </div>
          ) : (
            <TaxResultCard result={result} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculatorPage;