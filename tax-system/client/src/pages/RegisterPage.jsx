import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  idCard: '',
  taxCode: '',
};

const validate = (form) => {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên';
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
  }

  if (!form.email.trim()) {
    errors.email = 'Vui lòng nhập địa chỉ email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Địa chỉ email không hợp lệ';
  }

  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.phone.trim())) {
    errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
  }

  if (!form.idCard.trim()) {
    errors.idCard = 'Vui lòng nhập số CCCD (bắt buộc)';
  } else if (!/^\d{9}$|^\d{12}$/.test(form.idCard.trim())) {
    errors.idCard = 'CCCD phải có 9 hoặc 12 chữ số';
  }

  if (form.taxCode && !/^\d{10}$|^\d{13}$/.test(form.taxCode.trim())) {
    errors.taxCode = 'Mã số thuế phải có 10 hoặc 13 chữ số';
  }

  return errors;
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]           = useState(initialForm);
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const fieldErrors = validate(form);
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstErrorField = document.querySelector('.input-error');
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const { confirmPassword, ...submitData } = form;
      await register(submitData);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (field) =>
    `form-input${errors[field] ? ' input-error' : ''}`;

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--wide">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-wrapper">
            <span className="auth-logo-icon">🏛️</span>
          </div>
          <h1>TaxVN</h1>
          <p>Hệ thống khai báo thuế thu nhập cá nhân</p>
        </div>

        <h2>Tạo tài khoản</h2>

        {/* Lỗi từ server */}
        {serverError && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Họ và tên */}
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={getInputClass('fullName')}
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              disabled={loading}
            />
            {errors.fullName && <p className="error-text">⚠ {errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Địa chỉ Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={getInputClass('email')}
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <p className="error-text">⚠ {errors.email}</p>}
          </div>

          {/* Mật khẩu + Xác nhận — 2 cột */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mật khẩu <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className={getInputClass('password')}
                  placeholder="Ít nhất 6 ký tự"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="error-text">⚠ {errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={getInputClass('confirmPassword')}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-text">⚠ {errors.confirmPassword}</p>}
            </div>
          </div>

          {/* SĐT + CCCD — 2 cột */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={getInputClass('phone')}
                placeholder="0912345678"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="tel"
                disabled={loading}
                maxLength={10}
              />
              {errors.phone && <p className="error-text">⚠ {errors.phone}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="idCard">
                Số CCCD <span className="required">*</span>
              </label>
              <input
                id="idCard"
                name="idCard"
                type="text"
                className={getInputClass('idCard')}
                placeholder="012345678901"
                value={form.idCard}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                maxLength={12}
              />
              {errors.idCard && <p className="error-text">⚠ {errors.idCard}</p>}
            </div>
          </div>

          {/* Thông báo CCCD không thể thay đổi */}
          <div className="auth-info-box">
            <span className="info-icon">🔒</span>
            <span>
              <strong>Lưu ý quan trọng:</strong> Số CCCD sẽ được liên kết vĩnh viễn với tài khoản của bạn và <strong>không thể thay đổi</strong> sau khi đăng ký thành công. Vui lòng kiểm tra kỹ trước khi xác nhận.
            </span>
          </div>

          {/* Mã số thuế (không bắt buộc) */}
          <div className="form-group">
            <label className="form-label" htmlFor="taxCode">
              Mã số thuế{' '}
              <span className="optional">(không bắt buộc)</span>
            </label>
            <input
              id="taxCode"
              name="taxCode"
              type="text"
              className={getInputClass('taxCode')}
              placeholder="10 hoặc 13 chữ số"
              value={form.taxCode}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              maxLength={13}
            />
            {errors.taxCode && <p className="error-text">⚠ {errors.taxCode}</p>}
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Đang tạo tài khoản...
              </>
            ) : (
              '✅ Tạo tài khoản'
            )}
          </button>
        </form>

        <p className="auth-link">
          Đã có tài khoản?{' '}
          <Link to="/login">Đăng nhập ngay →</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;