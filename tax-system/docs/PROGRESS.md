# TIEN DO DU AN - He Thong Thue TNCN

> **Cach su dung**: Gui file nay cho Claude moi session de biet chinh xac tien do hien tai.
> Ky hieu: [x] Hoan thanh | [~] Dang lam | [ ] Chua bat dau | [!] Co van de

---

## THONG TIN DU AN
- **Cong nghe**: React 18 (JSX) + Express.js + MongoDB + CSS
- **Bat dau**: [NGAY_BAT_DAU]
- **Deadline**: [DEADLINE_DUOC_GIAO]
- **Cap nhat lan cuoi**: [NGAY_CAP_NHAT]

---

## PHASE 0 - KHUNG DU AN & SETUP
- [x] Tao cau truc thu muc day du
- [x] Root package.json (concurrently)
- [x] client/package.json (React 18, react-router-dom, axios, recharts)
- [x] server/package.json (express, mongoose, jwt, bcrypt, helmet)
- [x] server/.env.example
- [x] .gitignore
- [x] README.md
- [ ] Push len GitHub va kiem tra
- [ ] Test npm run install:all thanh cong

---

## PHASE 1 - BACKEND CO BAN
**Muc tieu**: Server chay duoc, ket noi MongoDB, auth hoat dong

### 1.1 Cau hinh & Core
- [x] server/src/index.js (Express app, middleware, routes)
- [x] server/src/config/db.js
- [x] server/src/config/taxRules.js (bieu thue VN 2024)
- [x] server/src/middleware/auth.js (JWT protect, adminOnly)
- [x] server/src/utils/taxCalculator.js (logic tinh thue luy tien)

### 1.2 Models (MongoDB Schema)
- [x] models/User.js (fullName, email, password, taxCode, role)
- [x] models/TaxDeclaration.js (incomes, deductions, taxAmount, status)
- [x] models/TaxConfig.js (bieu thue theo nam, giam tru)
- [x] models/Payment.js (lich su nop thue)

### 1.3 Controllers
- [x] controllers/authController.js (register, login, getMe)
- [x] controllers/taxController.js (calculate, declare, getDeclarations)
- [x] controllers/reportController.js (getUserReport, getSystemSummary)
- [x] controllers/userController.js (getAllUsers, updateProfile)

### 1.4 Routes
- [x] routes/authRoutes.js
- [x] routes/taxRoutes.js
- [x] routes/reportRoutes.js
- [x] routes/userRoutes.js
- [x] routes/configRoutes.js
- [ ] **TEST**: Kiem tra tat ca endpoints bang Postman/Thunder Client

---

## PHASE 2 - FRONTEND CO BAN
**Muc tieu**: Login, dashboard, layout hoat dong

### 2.1 Setup & Routing
- [x] client/src/index.jsx
- [x] client/src/App.jsx (Routes cau hinh day du)
- [x] context/AuthContext.jsx (login, logout, register, persist token)

### 2.2 Services (API calls)
- [x] services/api.js (axios instance, interceptors)
- [x] services/authService.js
- [x] services/taxService.js
- [x] services/reportService.js

### 2.3 Shared Components
- [x] components/shared/Layout.jsx (sidebar, topbar, responsive)
- [x] components/shared/PrivateRoute.jsx
- [x] components/shared/AdminRoute.jsx
- [x] components/shared/LoadingSpinner.jsx
- [x] components/shared/ErrorMessage.jsx

### 2.4 CSS
- [x] styles/global.css (variables, reset, common classes)
- [x] styles/layout.css (sidebar, topbar, responsive)
- [x] styles/auth.css (login/register page)
- [x] styles/dashboard.css (stat cards, action grid)

### 2.5 Pages (skeleton)
- [x] pages/LoginPage.jsx (form dang nhap co chuc nang)
- [x] pages/DashboardPage.jsx (stats + quick actions)
- [x] pages/RegisterPage.jsx (skeleton)
- [x] pages/TaxCalculatorPage.jsx (skeleton)
- [x] pages/TaxDeclarePage.jsx (skeleton)
- [x] pages/TaxHistoryPage.jsx (skeleton)
- [x] pages/ProfilePage.jsx (skeleton)
- [x] pages/ReportPage.jsx (skeleton)
- [x] pages/AdminPage.jsx (skeleton)
- [x] pages/NotFoundPage.jsx (skeleton)

### 2.6 Hooks & Utils
- [x] hooks/useTax.js
- [x] utils/formatters.js (formatCurrency, formatDate)

---

## PHASE 3 - NHOM CHUC NANG 1: KHAI BAO & TINH THUE
**Muc tieu**: User co the tinh thue, khai bao va nop thue

### 3.1 Dang ky / Dang nhap
- [ ] RegisterPage.jsx (form day du: ten, email, mat khau, SDT, CCCD)
- [ ] Validate client-side
- [ ] Xu ly loi tu server hien len UI

### 3.2 May tinh thue (TaxCalculatorPage)
- [ ] Form nhap thu nhap, so nguoi phu thuoc, giam tru khac
- [ ] Hien thi ket qua: thu nhap chiu thue, tung bac thue, tong thue
- [ ] Component TaxBracketTable.jsx
- [ ] Component TaxResultCard.jsx

### 3.3 Khai bao thue (TaxDeclarePage)
- [ ] Form khai bao: chon nam/thang, loai khai bao
- [ ] Them nhieu nguon thu nhap (dynamic form)
- [ ] Cau hinh giam tru (nguoi phu thuoc, bao hiem, tu thien)
- [ ] Xem truoc truoc khi gui
- [ ] Submit -> luu vao DB
- [ ] Component IncomeForm.jsx
- [ ] Component DeductionForm.jsx
- [ ] Component TaxPreview.jsx

### 3.4 Nộp thuế [DONE]
- [x] TaxHistoryPage.jsx hiển thị danh sách đầy đủ (filter trạng thái/năm, expand chi tiết, stat cards)
- [x] Nút "Nộp thuế" trên mỗi khai báo (chỉ hiện với status pending/overdue)
- [x] Modal xác nhận nộp thuế (PaymentModal - 3 bước: chọn phương thức -> xác nhận -> thành công)
- [x] Chọn phương thức thanh toán (bank_transfer, internet_banking, momo, vnpay)
- [x] Cập nhật trạng thái sang "paid" (backend: payDeclaration trong taxController.js)
- [x] Component PaymentModal.jsx + paymentModal.css
- [x] CAN FIX: TaxHistoryPage dùng `declaration.taxYear`, schema thực tế là `year` -> đã sửa đổi

### 3.5 ProfilePage [DONE]
- [x] Hiển thị thông tin cá nhân đầy đủ (Họ tên, email, CCCD, MST)
- [x] Form cập nhật thông tin cá nhân (Họ tên, SĐT, địa chỉ, ngày sinh)
- [x] Hiển thị mã số thuế & CCCD (chế độ chỉ đọc bảo mật có biểu tượng khóa 🔒)
- [x] Đổi mật khẩu tài khoản (Form bảo mật tại Tab riêng)

---

## PHASE 4 - NHOM CHUC NANG 2: BAO CAO & QUAN TRI
**Muc tieu**: Bao cao, xuat file, admin panel

### 4.1 Bao cao ca nhan (ReportPage - user)
- [ ] Bieu do thu nhap & thue theo nam (LineChart - recharts)
- [ ] Bang tong hop theo nam
- [ ] Loc theo nam
- [ ] Xuat PDF phieu thue ca nhan
- [ ] Component TaxChart.jsx
- [ ] Component YearlySummaryTable.jsx

### 4.2 Admin Panel (AdminPage)
- [ ] Tab: Danh sach nguoi dung
  - [ ] Hien thi tat ca user voi phan trang
  - [ ] Tim kiem theo ten, email, ma so thue
  - [ ] Nut khoa/mo khoa tai khoan
- [ ] Tab: Danh sach khai bao
  - [ ] Xem tat ca khai bao cua he thong
  - [ ] Loc theo trang thai, nam, nguoi dung
- [ ] Tab: Bao cao tong the
  - [ ] Tong so nguoi dung, khai bao, thue thu duoc
  - [ ] Bieu do theo thang/nam
- [ ] Component UserTable.jsx
- [ ] Component AdminDeclarationList.jsx
- [ ] Component SystemStats.jsx

### 4.3 Cau hinh he thong
- [ ] Trang cau hinh bieu thue (admin)
- [ ] Cap nhat muc giam tru ban than / nguoi phu thuoc
- [ ] Them/sua bieu thue theo nam
- [ ] Component TaxConfigForm.jsx

### 4.4 Xuat du lieu
- [ ] Xuat Excel danh sach khai bao (admin)
- [ ] Xuat PDF phieu thue ca nhan (user)
- [ ] Server: endpoint /api/reports/export/excel
- [ ] Server: endpoint /api/reports/export/pdf/:id

---

## PHASE 5 - HOAN THIEN & DEPLOY
- [ ] Validate tat ca forms
- [ ] Xu ly loi toan dien (error boundaries)
- [ ] Responsive mobile hoan chinh
- [ ] Seed data (bieu thue mau, admin mac dinh)
- [ ] Viet API.md (tai lieu API)
- [ ] Viet WORKFLOW.md (luong hoat dong)
- [ ] Test E2E co ban
- [ ] Build production
- [ ] Deploy (Render/Railway + MongoDB Atlas)

---

## VAN DE HIEN TAI
*(Ghi lai cac bug hoac diem can chu y)*

| STT | Van de | Trang thai | Ghi chu |
|-----|--------|------------|---------|
| 1 | TaxHistoryPage dung `taxYear` nhung schema TaxDeclaration dung `year` | Đã sửa | Sửa các fallback d.taxYear thành d.year ở frontend |
| 2 | Model Payment khong duoc dung trong payDeclaration | Đã quyết định | Đơn giản hóa, cập nhật trực tiếp trạng thái của TaxDeclaration |

---

## SESSION LOG
*(Ghi lai nhung gi da lam trong moi session)*

| Ngay | Viec da lam | Phase |
|------|-------------|-------|
| 2026-06-30 | Tạo khung dự án, các file cơ bản | Phase 0-2 |
| 2026-06-30 | Sửa trường taxYear -> year, triển khai trang ProfilePage đầy đủ chức năng và API đổi mật khẩu | Phase 3.4, 3.5 |

---

## LENH CHAY NHANH

```bash
# Chay du an
npm run dev

# Chi chay server
npm run server

# Chi chay client  
npm run client

# Cai dat lan dau
npm run install:all
```

## MUC TIEU SESSION TIEP THEO
- [ ] Hoàn thành Phase 3.1 (Đăng ký / Đăng nhập: validate & hiển thị lỗi từ server)
- [ ] Hoàn thành Phase 3.2 (Máy tính thuế: TaxBracketTable, TaxResultCard)
- [ ] Hoàn thành Phase 3.3 (Khai báo thuế: Form động thêm nhiều nguồn thu nhập & giảm trừ)
- [ ] Bắt đầu Phase 4.1 (Báo cáo cá nhân: Biểu đồ Recharts, xuất PDF cá nhân)
