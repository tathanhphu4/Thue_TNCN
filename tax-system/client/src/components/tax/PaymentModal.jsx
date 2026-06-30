import { useState } from "react";
import "../../styles/paymentModal.css";

const PAYMENT_METHODS = [
  {
    id: "bank_transfer",
    label: "Chuyển khoản ngân hàng",
    icon: "🏦",
    desc: "Chuyển khoản qua tài khoản kho bạc nhà nước",
  },
  {
    id: "internet_banking",
    label: "Internet Banking",
    icon: "💻",
    desc: "Thanh toán qua cổng ngân hàng trực tuyến",
  },
  {
    id: "momo",
    label: "Ví MoMo",
    icon: "📱",
    desc: "Thanh toán qua ví điện tử MoMo",
  },
  {
    id: "vnpay",
    label: "VNPay",
    icon: "💳",
    desc: "Thanh toán qua cổng VNPay",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export default function PaymentModal({ declaration, onClose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState(1); // 1: chon phuong thuc, 2: xac nhan, 3: thanh cong
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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