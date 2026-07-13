import { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import "../../styles/paymentModal.css";

const PAYMENT_METHODS = [
  {
    id: "bank_transfer",
    label: "Chuyển khoản Kho bạc Nhà nước",
    icon: "🏦",
    desc: "Chuyển khoản qua tài khoản ngân hàng của Kho bạc Nhà nước",
  },
  {
    id: "internet_banking",
    label: "Thanh toán bằng QR Code",
    icon: "📱",
    desc: "Quét mã QR để chuyển khoản nhanh",
  },
];

export default function PaymentModal({ declaration, onClose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState(1); // 1: chon phuong thuc, 2: xac nhan, 3: thanh cong
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrLoaded, setQrLoaded] = useState(true);
  const [copiedField, setCopiedField] = useState("");

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmitPayment = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tax/declarations/${declaration._id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethod: selectedMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Nộp thuế thất bại.");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onSuccess && onSuccess();
    onClose();
  };

  const taxAmount = declaration?.taxAmount || 0;
  const year = declaration?.year || "";
  const declId = declaration?._id?.slice(-6).toUpperCase() || "";

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="payment-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <h2>
              {step === 3 ? "✅ Thanh toán thành công" : "Nộp thuế thu nhập cá nhân"}
            </h2>
            {step !== 3 && (
              <p>
                Khai báo #{declId} &bull; Năm {year}
              </p>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Step indicator */}
        {step !== 3 && (
          <div className="modal-steps">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span>1</span> Chọn phương thức
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span>2</span> Xác nhận
            </div>
          </div>
        )}

        <div className="modal-body">
          {/* STEP 1: Chon phuong thuc */}
          {step === 1 && (
            <>
              <div className="payment-amount-box">
                <span className="amount-label">Số tiền cần nộp</span>
                <span className="amount-value">{formatCurrency(taxAmount)}</span>
              </div>

              <h3 className="section-label">Chọn phương thức thanh toán</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`method-card ${selectedMethod === m.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={selectedMethod === m.id}
                      onChange={() => setSelectedMethod(m.id)}
                    />
                    <span className="method-icon">{m.icon}</span>
                    <div className="method-info">
                      <strong>{m.label}</strong>
                      <small>{m.desc}</small>
                    </div>
                    {selectedMethod === m.id && <span className="check-mark">✓</span>}
                  </label>
                ))}
              </div>

              {error && <p className="modal-error">{error}</p>}

              <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>
                  Hủy
                </button>
                <button className="btn-primary" onClick={handleConfirmPayment}>
                  Tiếp tục →
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Xac nhan */}
          {step === 2 && (
            <>
              <div className="confirm-box">
                <h3>Xác nhận thông tin nộp thuế</h3>
                <table className="confirm-table">
                  <tbody>
                    <tr>
                      <td>Mã khai báo</td>
                      <td>
                        <strong>#{declId}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Năm thuế</td>
                      <td>
                        <strong>{year}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Phương thức</td>
                      <td>
                        <strong>
                          {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
                        </strong>
                      </td>
                    </tr>
                    <tr className="row-total">
                      <td>Số tiền nộp</td>
                      <td>
                        <strong className="total-amount">{formatCurrency(taxAmount)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="confirm-notice">
                  ⚠️ Sau khi xác nhận, giao dịch sẽ được ghi nhận và không thể hoàn tác.
                </div>
              </div>

              {selectedMethod === "bank_transfer" && (
                <div className="payment-instructions-box">
                  <h4>🏦 Thông tin tài khoản Kho bạc Nhà nước:</h4>
                  <div className="instruction-row">
                    <span>Ngân hàng:</span>
                    <strong>VietinBank (Ngân hàng TMCP Công Thương VN)</strong>
                  </div>
                  <div className="instruction-row">
                    <span>Số tài khoản:</span>
                    <strong 
                      className="clickable-text" 
                      onClick={() => handleCopy("112000999999", "account")}
                      title="Click để sao chép"
                    >
                      112000999999 {copiedField === "account" ? "✅ Đã sao chép!" : "📋 Sao chép"}
                    </strong>
                  </div>
                  <div className="instruction-row">
                    <span>Tên tài khoản:</span>
                    <strong>KHO BẠC NHÀ NƯỚC HÀ NỘI</strong>
                  </div>
                  <div className="instruction-row">
                    <span>Nội dung chuyển khoản:</span>
                    <strong 
                      className="clickable-text" 
                      onClick={() => handleCopy(`NOP THUE ${declId}`, "content")}
                      title="Click để sao chép"
                    >
                      NOP THUE {declId} {copiedField === "content" ? "✅ Đã sao chép!" : "📋 Sao chép"}
                    </strong>
                  </div>
                  <div className="instruction-row">
                    <span>Số tiền:</span>
                    <strong className="text-danger">{formatCurrency(taxAmount)}</strong>
                  </div>
                  <small className="instruction-tip">
                    * Bấm vào số tài khoản hoặc nội dung để sao chép nhanh.
                  </small>
                </div>
              )}

              {selectedMethod === "internet_banking" && (
                <div className="payment-instructions-box text-center">
                  <h4>📱 Quét mã QR dưới đây để thanh toán:</h4>
                  <div className="qr-container">
                    {qrLoaded ? (
                      <img
                        src="/images/qr_payment.png"
                        alt="Mã QR Kho bạc Nhà nước"
                        className="qr-image"
                        onError={() => setQrLoaded(false)}
                      />
                    ) : (
                      <div className="qr-placeholder-card">
                        <span className="qr-placeholder-icon">🔲</span>
                        <p>Mã QR chưa được tải</p>
                        <small>Vui lòng upload hình ảnh QR của bạn vào đường dẫn:</small>
                        <code>client/public/images/qr_payment.png</code>
                      </div>
                    )}
                  </div>
                  <div className="instruction-row mt-2">
                    <span>Nội dung:</span>
                    <strong 
                      className="clickable-text" 
                      onClick={() => handleCopy(`NOP THUE ${declId}`, "content_qr")}
                      title="Click để sao chép"
                    >
                      NOP THUE {declId} {copiedField === "content_qr" ? "✅ Đã chép!" : "📋 Chép"}
                    </strong>
                  </div>
                  <div className="instruction-row">
                    <span>Số tiền:</span>
                    <strong className="text-danger">{formatCurrency(taxAmount)}</strong>
                  </div>
                </div>
              )}

              {error && <p className="modal-error">{error}</p>}

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setStep(1)} disabled={loading}>
                  ← Quay lại
                </button>
                <button
                  className="btn-primary btn-pay"
                  onClick={handleSubmitPayment}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "✓ Xác nhận nộp thuế"}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Thanh cong */}
          {step === 3 && (
            <div className="success-view">
              <div className="success-icon">✅</div>
              <h3>Nộp thuế thành công!</h3>
              <p>
                Bạn đã hoàn tất việc nộp thuế TNCN năm <strong>{year}</strong>.
              </p>
              <div className="success-details">
                <div>
                  <span>Số tiền đã nộp</span>
                  <strong>{formatCurrency(taxAmount)}</strong>
                </div>
                <div>
                  <span>Phương thức</span>
                  <strong>
                    {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
                  </strong>
                </div>
                <div>
                  <span>Trạng thái</span>
                  <strong className="status-paid">Đã thanh toán</strong>
                </div>
              </div>
              <button className="btn-primary" onClick={handleDone}>
                Hoàn tất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}