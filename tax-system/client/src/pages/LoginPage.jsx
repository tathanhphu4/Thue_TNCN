import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/shared/ErrorMessage';
import '../styles/auth.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>TaxVN</h1>
          <p>Hệ thống thuế thu nhập cá nhân</p>
        </div>
        <h2>Đăng nhập</h2>
        <ErrorMessage message={error} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="email@example.com" required />
          </div>
          <div className="form-group">
            <label>Mat khau</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="**********" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Dang dang nhap...' : 'Dang nhap'}
          </button>
        </form>
        <p className="auth-link">
          Chua co tai khoan? <Link to="/register">Dang ky ngay</Link>
        </p>
      </div>
    </div>
  );
}
