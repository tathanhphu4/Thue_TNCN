import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taxService } from '../services/taxService';
import IncomeForm from '../components/tax/IncomeForm';
import DeductionForm from '../components/tax/DeductionForm';
import TaxPreview from '../components/tax/TaxPreview';
import '../styles/declare.css';

const PERSONAL_DEDUCTION  = 11000000;
const DEPENDENT_DEDUCTION =  4400000;
const INSURANCE_RATE      = 0.105;
const TAX_BRACKETS = [
  { level: 1, min: 0,        max: 5000000,   rate: 0.05 },
  { level: 2, min: 5000000,  max: 10000000,  rate: 0.10 },
  { level: 3, min: 10000000, max: 18000000,  rate: 0.15 },
  { level: 4, min: 18000000, max: 32000000,  rate: 0.20 },
  { level: 5, min: 32000000, max: 52000000,  rate: 0.25 },
  { level: 6, min: 52000000, max: 80000000,  rate: 0.30 },
  { level: 7, min: 80000000, max: null,      rate: 0.35 },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

// Tính thuế client-side để preview
const computeTax = (incomes, deductions) => {
  const totalIncome = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const dep = deductions.find(d => d.type === 'dependent');
  const dependents = dep?.dependents || 0;
  const insurance = Number(deductions.find(d => d.type === 'insurance')?.amount || 0);
  const charity   = Number(deductions.find(d => d.type === 'charity')?.amount || 0);
  const other     = Number(deductions.find(d => d.type === 'other')?.amount || 0);

  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
  const totalDeduction = PERSONAL_DEDUCTION + (insurance || Math.round(totalIncome * INSURANCE_RATE)) + dependentDeduction + charity + other;
  const taxableIncome = Math.max(0, totalIncome - totalDeduction);

  let taxAmount = 0;
  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.min) break;
    const upper = b.max ? Math.min(taxableIncome, b.max) : taxableIncome;
    taxAmount += Math.round((upper - b.min) * b.rate);
  }

  const netIncome = totalIncome - (insurance || Math.round(totalIncome * INSURANCE_RATE)) - taxAmount;

  return { totalIncome, personalDeduction: PERSONAL_DEDUCTION, dependentDeduction, totalDeduction, taxableIncome, taxAmount, netIncome };
};

const STEPS = ['Thông tin kỳ', 'Thu nhập', 'Giảm trừ', 'Xem trước'];

const TaxDeclarePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [period, setPeriod] = useState({
    year: currentYear,
    month: new Date().getMonth() + 1,
    declarationType: 'monthly',
  });
  const [incomes, setIncomes] = useState([
    { id: 1, source: 'salary', description: '', amount: '' },
  ]);
  const [deductions, setDeductions] = useState([]);
  const [errors, setErrors] = useState({});

  // Validate từng step
  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!period.year) errs.year = 'Chọn năm';
      if (period.declarationType === 'monthly' && !period.month) errs.month = 'Chọn tháng';
    }
    if (s === 1) {
      if (incomes.length === 0) errs.incomes = 'Cần ít nhất 1 nguồn thu nhập';
      const hasEmpty = incomes.some(i => !i.amount || Number(i.amount) <= 0);
      if (hasEmpty) errs.incomes = 'Vui lòng nhập số tiền cho tất cả nguồn thu nhập';
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError('');
    try {
      const payload = {
        year: period.year,
        month: period.declarationType === 'monthly' ? period.month : null,
        declarationType: period.declarationType,
        incomes: incomes.map(({ id, ...i }) => ({ ...i, amount: Number(i.amount) })),
        deductions: deductions.map(d => ({ ...d, amount: Number(d.amount) || 0 })),
      };
      await taxService.declare(payload);
      setSuccess(true);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Gửi khai báo thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Tính preview data
  const computed = computeTax(incomes, deductions);

  // Màn hình thành công
  if (success) {
    return (
      <div className="declare-page">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Khai báo thành công!</h2>
          <p>Khai báo thuế của bạn đã được gửi và đang chờ xử lý.</p>
          <div className="success-summary">
            <div className="success-row">
              <span>Thuế phải nộp</span>
              <strong className="text-danger">{computed.taxAmount.toLocaleString('vi-VN')}đ</strong>
            </div>
            <div className="success-row">
              <span>Thu nhập NET</span>
              <strong>{computed.netIncome.toLocaleString('vi-VN')}đ</strong>
            </div>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/tax-history')}>
              📋 Xem lịch sử khai báo
            </button>
            <button className="btn btn-outline" onClick={() => { setSuccess(false); setStep(0); setIncomes([{ id: 1, source: 'salary', description: '', amount: '' }]); setDeductions([]); setPeriod({ year: currentYear, month: new Date().getMonth() + 1, declarationType: 'monthly' }); }}>
              + Khai báo mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="declare-page">
      <div className="declare-header">
        <h1 className="declare-title">📝 Khai báo thuế TNCN</h1>
        <p className="declare-subtitle">Điền đầy đủ thông tin để hoàn thành khai báo thuế</p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={i} className={`step${i === step ? ' step--active' : ''}${i < step ? ' step--done' : ''}`}>
            <div className="step__circle">
              {i < step ? '✓' : i + 1}
            </div>
            <span className="step__label">{label}</span>
            {i < STEPS.length - 1 && <div className="step__line" />}
          </div>
        ))}
      </div>

      {/* Lỗi server */}
      {serverError && (
        <div className="alert alert-error">⚠️ {serverError}</div>
      )}

      {/* Step 0: Thông tin kỳ */}
      {step === 0 && (
        <div className="declare-section">
          <div className="declare-section-header">
            <h3>📅 Chọn kỳ khai báo</h3>
          </div>

          {/* Loại khai báo */}
          <div className="form-group">
            <label className="form-label">Loại khai báo</label>
            <div className="radio-group">
              <label className={`radio-card${period.declarationType === 'monthly' ? ' radio-card--active' : ''}`}>
                <input type="radio" name="declarationType" value="monthly"
                  checked={period.declarationType === 'monthly'}
                  onChange={e => setPeriod(p => ({ ...p, declarationType: e.target.value }))} />
                <span className="radio-icon">📅</span>
                <span className="radio-label">Theo tháng</span>
              </label>
              <label className={`radio-card${period.declarationType === 'annual' ? ' radio-card--active' : ''}`}>
                <input type="radio" name="declarationType" value="annual"
                  checked={period.declarationType === 'annual'}
                  onChange={e => setPeriod(p => ({ ...p, declarationType: e.target.value }))} />
                <span className="radio-icon">📆</span>
                <span className="radio-label">Theo năm</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            {/* Năm */}
            <div className="form-group">
              <label className="form-label">Năm <span className="required">*</span></label>
              <select className={`form-input${errors.year ? ' input-error' : ''}`}
                value={period.year}
                onChange={e => setPeriod(p => ({ ...p, year: Number(e.target.value) }))}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <p className="error-text">{errors.year}</p>}
            </div>

            {/* Tháng */}
            {period.declarationType === 'monthly' && (
              <div className="form-group">
                <label className="form-label">Tháng <span className="required">*</span></label>
                <select className={`form-input${errors.month ? ' input-error' : ''}`}
                  value={period.month}
                  onChange={e => setPeriod(p => ({ ...p, month: Number(e.target.value) }))}>
                  {MONTHS.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                </select>
                {errors.month && <p className="error-text">{errors.month}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Thu nhập */}
      {step === 1 && (
        <>
          <IncomeForm incomes={incomes} onChange={setIncomes} />
          {errors.incomes && <p className="error-text" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>⚠ {errors.incomes}</p>}
        </>
      )}

      {/* Step 2: Giảm trừ */}
      {step === 2 && (
        <DeductionForm
          deductions={deductions}
          onChange={setDeductions}
          totalIncome={computed.totalIncome}
        />
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <TaxPreview
          data={{ ...period, incomes, deductions, computed }}
          onConfirm={handleSubmit}
          onBack={handleBack}
          loading={loading}
        />
      )}

      {/* Navigation buttons (không hiện ở step preview) */}
      {step < 3 && (
        <div className="declare-nav">
          {step > 0 && (
            <button type="button" className="btn btn-outline" onClick={handleBack}>
              ← Quay lại
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            {step === 2 ? '👁️ Xem trước' : 'Tiếp theo →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxDeclarePage;