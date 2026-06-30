import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { taxService } from "../services/taxService";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { formatCurrency, formatDate } from "../utils/formatters";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({ total: 0, paid: 0, totalTax: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await authService.getMe();
        const fullUser = userRes.user || userRes.data || userRes;
        if (fullUser) {
          updateUser(fullUser);
          setProfileForm({
            fullName: fullUser.fullName || "",
            phone: fullUser.phone || "",
            address: fullUser.address || "",
            dateOfBirth: fullUser.dateOfBirth ? fullUser.dateOfBirth.split("T")[0] : "",
          });
        }

        const taxRes = await taxService.getDeclarations();
        const declarations = taxRes?.data || taxRes || [];
        const paid = declarations.filter((d) => d.status === "paid");
        setStats({
          total: declarations.length,
          paid: paid.length,
          totalTax: paid.reduce((s, d) => s + (d.taxAmount || 0), 0),
        });
      } catch (err) {
        console.error("Lỗi khi tải thông tin hồ sơ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAlert(null);

    const newErrors = {};
    if (!profileForm.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }
    if (profileForm.phone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(profileForm.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(profileForm);
      const updatedUser = res.data || res;
      const mergedUser = { ...user, ...updatedUser };
      updateUser(mergedUser);
      setAlert({ type: "success", message: "Cập nhật hồ sơ thành công!" });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Cập nhật thất bại. Vui lòng thử lại.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAlert(null);

    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSavingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setAlert({ type: "success", message: "Đổi mật khẩu thành công!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <LoadingSpinner message="Đang tải thông tin hồ sơ..." />;

  const avatarChar = user?.fullName?.charAt(0)?.toUpperCase() || "?";
  const userRoleText = user?.role === 'admin' ? '⚙️ Quản trị viên' : '👤 Người nộp thuế';

  return (
    <div className="page-container">
      <h1 className="page-title">👤 Hồ sơ cá nhân</h1>

      <div className="profile-container">
        {/* Left pane: Avatar, info, stats */}
        <div className="profile-sidebar">
          <div className="avatar-wrapper">
            <div className="avatar-circle">{avatarChar}</div>
          </div>
          <h2 style={{ margin: 0, color: "var(--primary)", fontSize: "1.4rem" }}>
            {user?.fullName}
          </h2>
          <p style={{ margin: "0.25rem 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {user?.email}
          </p>
          <span className={`role-badge ${user?.role || "user"}`}>{userRoleText}</span>

          <div className="profile-sidebar-stats">
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Tổng khai báo</span>
              <span className="sidebar-stat-value">{stats.total}</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Đã nộp thuế</span>
              <span className="sidebar-stat-value">{stats.paid}</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-label">Tổng tiền đã nộp</span>
              <span className="sidebar-stat-value" style={{ color: "#10b981" }}>
                {formatCurrency(stats.totalTax)}
              </span>
            </div>
          </div>
        </div>

        {/* Right pane: Tabs and details form */}
        <div className="profile-content-card">
          <div className="profile-tabs-header">
            <button
              className={`profile-tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("info");
                setAlert(null);
                setErrors({});
              }}
            >
              👤 Thông tin tài khoản
            </button>
            <button
              className={`profile-tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("password");
                setAlert(null);
                setErrors({});
              }}
            >
              🔑 Đổi mật khẩu
            </button>
          </div>

          <div className="profile-tabs-body">
            {alert && (
              <div className={`profile-alert profile-alert-${alert.type}`}>
                <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
                {alert.message}
              </div>
            )}

            {activeTab === "info" ? (
              <form onSubmit={handleProfileSubmit}>
                <div className="form-grid">
                  {/* Họ tên */}
                  <div className="form-group">
                    <label htmlFor="fullName">Họ và tên *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && <p className="error-text" style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{errors.fullName}</p>}
                  </div>

                  {/* Email (Readonly) */}
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="profile-input-wrapper">
                      <input
                        type="email"
                        id="email"
                        value={user?.email || ""}
                        readOnly
                        className="input-read-only"
                      />
                      <span className="input-lock-icon" title="Không thể tự sửa Email">🔒</span>
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="09xxxxxxxx"
                      maxLength={10}
                    />
                    {errors.phone && <p className="error-text" style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{errors.phone}</p>}
                  </div>

                  {/* Ngày sinh */}
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Ngày sinh</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={profileForm.dateOfBirth}
                      onChange={handleProfileChange}
                    />
                  </div>

                  {/* CCCD - Vĩnh viễn, không thể thay đổi */}
                  <div className="form-group">
                    <label htmlFor="idNumber" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Số CCCD / CMND
                      <span style={{
                        fontSize: '0.7rem',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.3px'
                      }}>🔒 Không thể thay đổi</span>
                    </label>
                    <div className="profile-input-wrapper">
                      <input
                        type="text"
                        id="idNumber"
                        value={user?.idNumber || 'Chưa cập nhật'}
                        readOnly
                        className="input-read-only"
                        style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                      />
                      <span className="input-lock-icon" title="CCCD được liên kết vĩnh viễn khi đăng ký, không thể thay đổi">🔒</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                      Số CCCD được liên kết vĩnh viễn với tài khoản của bạn.
                    </p>
                  </div>

                  {/* Mã số thuế (Readonly) */}
                  <div className="form-group">
                    <label htmlFor="taxCode">Mã số thuế cá nhân</label>
                    <div className="profile-input-wrapper">
                      <input
                        type="text"
                        id="taxCode"
                        value={user?.taxCode || 'Chưa cập nhật'}
                        readOnly
                        className="input-read-only"
                        style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                      />
                      <span className="input-lock-icon" title="Liên hệ chi cục thuế để cập nhật mã số thuế">🔒</span>
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="form-group form-grid-full">
                    <label htmlFor="address">Địa chỉ thường trú</label>
                    <textarea
                      id="address"
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      rows={3}
                      style={{ resize: "vertical" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary profile-submit-btn"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <span className="spinner" /> Đang cập nhật...
                    </>
                  ) : (
                    "Lưu thông tin"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "500px" }}>
                  {/* Mật khẩu cũ */}
                  <div className="form-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••"
                    />
                    {errors.currentPassword && (
                      <p className="error-text" style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới *</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ít nhất 6 ký tự"
                    />
                    {errors.newPassword && (
                      <p className="error-text" style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    {errors.confirmPassword && (
                      <p className="error-text" style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary profile-submit-btn"
                    disabled={savingPassword}
                  >
                    {savingPassword ? (
                      <>
                        <span className="spinner" /> Đang thay đổi...
                      </>
                    ) : (
                      "Đổi mật khẩu"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
