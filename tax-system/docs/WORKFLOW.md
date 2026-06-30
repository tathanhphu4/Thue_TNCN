# WORKFLOW - Luồng Hoạt Động Hệ Thống Thuế TNCN

## Tổng quan kiến trúc

```
[React Client :3000]
        │  HTTP (Proxy → localhost:5000)
        ▼
[Express Server :5000]
        │
        ├─ JWT Auth Middleware
        ├─ Rate Limiter (auth routes)
        │
        ▼
[MongoDB] ←→ [Models: User, TaxDeclaration, TaxConfig]
```

---

## 1. Luồng Người dùng thông thường (User)

### 1.1 Đăng ký & Đăng nhập
```
Đăng ký:
  Nhập: Họ tên, Email, Mật khẩu, SĐT, CCCD, MST (tùy chọn)
  → Client validate (format, độ dài)
  → POST /api/auth/register
  → Server validate (express-validator)
  → Lưu User vào MongoDB (bcrypt hash mật khẩu)
  → Trả về JWT → lưu localStorage → /dashboard

Đăng nhập:
  → POST /api/auth/login
  → So sánh mật khẩu (bcryptjs.compare)
  → Kiểm tra isActive (bị khóa → 403)
  → Trả về JWT → localStorage → /dashboard
```

### 1.2 Tính thuế nhanh
```
[/tax/calculator]
→ Nhập: Tổng thu nhập, Số người phụ thuộc, Giảm trừ khác, Năm
→ POST /api/tax/calculate
→ Server lấy TaxConfig từ DB (fallback config tĩnh)
→ Tính thuế lũy tiến từng bậc
→ Hiển thị bảng kết quả chi tiết
```

### 1.3 Khai báo thuế
```
[/tax/declare]
→ Chọn: Năm/Tháng, Loại khai báo (annual/monthly)
→ Thêm các nguồn thu nhập (dynamic form)
→ Thêm các khoản giảm trừ
→ Preview tính toán trước khi gửi
→ POST /api/tax/declare → lưu DB (status: "pending")
```

### 1.4 Nộp thuế
```
[/tax/history]
→ Danh sách tờ khai (filter trạng thái/năm)
→ Nhấn "Nộp thuế" (chỉ với pending/overdue)
→ Modal 3 bước:
    1. Chọn phương thức (bank_transfer/momo/vnpay/internet_banking)
    2. Xác nhận thông tin + số tiền
    3. Thành công
→ POST /api/tax/declarations/:id/pay
→ Cập nhật status → "paid", lưu paidAt, paymentMethod
```

### 1.5 Báo cáo cá nhân
```
[/reports]
→ GET /api/reports/user → tổng hợp theo năm
→ AreaChart: Thu nhập theo năm
→ BarChart: Thuế phải nộp vs Đã nộp
→ "Tải PDF" → /api/reports/export/pdf/:id → PDFKit (Arial font VN)
```

### 1.6 Hồ sơ cá nhân
```
[/profile]
→ Tab 1: Xem/sửa thông tin (Tên, SĐT, Địa chỉ, Ngày sinh)
         PUT /api/users/me
→ Tab 2: Đổi mật khẩu
         PUT /api/users/change-password
```

---

## 2. Luồng Quản trị viên (Admin)

```
[/admin] - 4 Tab:

Tab 1 - Danh sách người dùng:
  GET /api/users → bảng toàn bộ user
  Tìm kiếm client-side (Tên/Email/CCCD/MST)
  PUT /api/users/:id/toggle-status → Khóa/Mở khóa

Tab 2 - Quản lý tờ khai:
  GET /api/tax/admin/declarations → toàn bộ tờ khai
  Filter: Trạng thái + Năm
  GET /api/reports/export/excel → tải .xlsx

Tab 3 - Thống kê:
  GET /api/reports/summary → tổng user, khai báo, thuế
  LineChart + BarChart theo năm

Tab 4 - Biểu thuế:
  GET /api/config/tax-rules → cấu hình năm
  PUT /api/config/tax-rules → lưu TaxConfig vào MongoDB
```

---

## 3. Luồng bảo mật

```
[Mỗi API request protected]:
→ Middleware protect:
    1. Tách JWT từ Authorization header
    2. jwt.verify(token, JWT_SECRET)
    3. Tìm User theo decoded.id
    4. Kiểm tra isActive → 403 nếu bị khóa
    5. Gán req.user → next()

[Admin-only]:
→ Middleware adminOnly: req.user.role === 'admin' → 403 nếu không phải

[Token hết hạn (401)]:
→ Axios interceptor → xóa localStorage → redirect /login

[Rate limiting]:
→ /api/auth/* → tối đa 10 req/phút/IP → 429 nếu vượt
```

---

## 4. Sơ đồ dữ liệu

```
User
 ├─ fullName, email, password(hash), phone, idNumber, taxCode
 ├─ role: "user" | "admin"
 ├─ isActive: Boolean
 └─ createdAt

TaxDeclaration
 ├─ user (ref → User), year, month, declarationType
 ├─ incomes: [{ source, amount }]
 ├─ deductions: [{ type, amount }]
 ├─ totalIncome, totalDeduction, taxableIncome, taxAmount
 ├─ status: "draft" | "pending" | "submitted" | "paid" | "overdue"
 └─ paidAt, paymentMethod

TaxConfig
 ├─ year (unique), personalDeduction, dependentDeduction
 └─ taxBrackets: [{ min, max, rate }]
```
