# TIEN DO DU AN - He Thong Thue TNCN

> **Cach su dung**: Gui file nay cho Claude moi session de biet chinh xac tien do hien tai.
> Ky hieu: [x] Hoan thanh | [~] Dang lam | [ ] Chua bat dau | [!] Co van de

---

## THONG TIN DU AN
- **Cong nghe**: React 18 (JSX) + Express.js + MongoDB + CSS
- **Bat dau**: 2026-06-30
- **Deadline**: [DEADLINE_DUOC_GIAO]
- **Cap nhat lan cuoi**: 2026-06-30 (09:00)

---

## PHASE 0 - KHUNG DU AN & SETUP ✅ HOAN THANH
- [x] Tao cau truc thu muc day du
- [x] Root package.json (concurrently)
- [x] client/package.json (React 18, react-router-dom, axios, recharts)
- [x] server/package.json (express, mongoose, jwt, bcrypt, helmet)
- [x] server/.env.example
- [x] .gitignore
- [x] README.md
- [x] Push len GitHub va kiem tra

---

## PHASE 1 - BACKEND CO BAN ✅ HOAN THANH
**Muc tieu**: Server chay duoc, ket noi MongoDB, auth hoat dong

### 1.1 Cau hinh & Core
- [x] server/src/index.js (Express app, middleware, routes)
- [x] server/src/config/db.js
- [x] server/src/config/taxRules.js (bieu thue VN 2024)
- [x] server/src/middleware/auth.js (JWT protect, adminOnly)
- [x] server/src/utils/taxCalculator.js (logic tinh thue luy tien, ho tro custom brackets)

### 1.2 Models (MongoDB Schema)
- [x] models/User.js (fullName, email, password, taxCode, role, isActive)
- [x] models/TaxDeclaration.js (incomes, deductions, taxAmount, status, paidAt, paymentMethod)
- [x] models/TaxConfig.js (bieu thue theo nam, giam tru - dynamic)
- [x] models/Payment.js

### 1.3 Controllers
- [x] controllers/authController.js (register, login, getMe)
- [x] controllers/taxController.js (calculate, declare, getDeclarations, payDeclaration, getAllDeclarations)
- [x] controllers/reportController.js (getUserReport, getSystemSummary, exportPDF, exportExcel)
- [x] controllers/userController.js (getAllUsers, updateProfile, changePassword, toggleUserStatus)

### 1.4 Routes
- [x] routes/authRoutes.js
- [x] routes/taxRoutes.js (+ /admin/declarations)
- [x] routes/reportRoutes.js (+ /export/pdf/:id, /export/excel)
- [x] routes/userRoutes.js (+ /change-password, /:id/toggle-status)
- [x] routes/configRoutes.js (GET+PUT /api/config/tax-rules - dynamic TaxConfig)

---

## PHASE 2 - FRONTEND CO BAN ✅ HOAN THANH
**Muc tieu**: Login, dashboard, layout hoat dong

### 2.1 Setup & Routing
- [x] client/src/index.jsx
- [x] client/src/App.jsx (Routes cau hinh day du)
- [x] context/AuthContext.jsx (login, logout, register, persist token, updateUser)

### 2.2 Services (API calls)
- [x] services/api.js (axios instance, interceptors)
- [x] services/authService.js
- [x] services/taxService.js (+ getAllDeclarations, getTaxRules, updateTaxRules)
- [x] services/reportService.js (getSystemSummary, exportPDF)
- [x] services/userService.js (getAllUsers, toggleUserStatus)

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
- [x] styles/profile.css (profile page)
- [x] styles/admin.css (admin panel)

### 2.5 Pages - Tất cả đã đầy đủ chức năng
- [x] pages/LoginPage.jsx
- [x] pages/RegisterPage.jsx
- [x] pages/DashboardPage.jsx (stats + quick actions)
- [x] pages/TaxCalculatorPage.jsx
- [x] pages/TaxDeclarePage.jsx
- [x] pages/TaxHistoryPage.jsx (filter, expand chi tiet, PaymentModal)
- [x] pages/ProfilePage.jsx (cap nhat thong tin, doi mat khau)
- [x] pages/ReportPage.jsx (Recharts AreaChart+BarChart, loc nam, tai PDF)
- [x] pages/AdminPage.jsx (4 Tab: Users, Declarations, Reports, Config)
- [x] pages/NotFoundPage.jsx

### 2.6 Hooks & Utils
- [x] hooks/useTax.js
- [x] utils/formatters.js (formatCurrency, formatDate)

---

## PHASE 3 - NHOM CHUC NANG 1: KHAI BAO & TINH THUE ✅ HOAN THANH

### 3.1 Dang ky / Dang nhap
- [x] RegisterPage.jsx (form day du: ten, email, mat khau, SDT, CCCD)
- [x] Validate client-side
- [x] Xu ly loi tu server hien len UI

### 3.2 May tinh thue (TaxCalculatorPage)
- [x] Form nhap thu nhap, so nguoi phu thuoc, giam tru khac
- [x] Hien thi ket qua: thu nhap chiu thue, tung bac thue, tong thue
- [x] Component TaxBracketTable / TaxResultCard (inline trong Calculator)

### 3.3 Khai bao thue (TaxDeclarePage)
- [x] Form khai bao: chon nam/thang, loai khai bao (hang thang/ca nam)
- [x] Them nhieu nguon thu nhap (dynamic form)
- [x] Cau hinh giam tru (nguoi phu thuoc, bao hiem, tu thien)
- [x] Xem truoc truoc khi gui
- [x] Submit -> luu vao DB

### 3.4 Nop thue
- [x] TaxHistoryPage.jsx (filter trang thai/nam, expand chi tiet, stat cards)
- [x] Nut "Nop thue" tren moi khai bao (chi hien voi status pending/overdue)
- [x] PaymentModal - 3 buoc: chon phuong thuc -> xac nhan -> thanh cong
- [x] 4 phuong thuc: bank_transfer, internet_banking, momo, vnpay
- [x] Backend: payDeclaration cap nhat trang thai sang "paid"

### 3.5 ProfilePage
- [x] Hien thi thong tin ca nhan day du (Ho ten, email, CCCD, MST)
- [x] Form cap nhat thong tin ca nhan
- [x] Hien thi ma so thue & CCCD (che do chi doc - khoa)
- [x] Doi mat khau tai khoan (Form bao mat)

---

## PHASE 4 - NHOM CHUC NANG 2: BAO CAO & QUAN TRI ✅ HOAN THANH

### 4.1 Bao cao ca nhan (ReportPage)
- [x] Bieu do thu nhap & thue theo nam (AreaChart + BarChart - recharts)
- [x] Bang tong hop theo nam
- [x] Loc theo nam
- [x] Xuat PDF phieu thue ca nhan (ho tro tieng Viet bang font Arial)

### 4.2 Admin Panel (AdminPage - 4 Tab)
- [x] Tab 1: Danh sach nguoi dung
  - [x] Hien thi tat ca user (co phan trang)
  - [x] Tim kiem theo ten, email, MST, CCCD
  - [x] Nut khoa/mo khoa tai khoan (goi API toggleUserStatus)
- [x] Tab 2: Danh sach khai bao
  - [x] Xem tat ca khai bao cua he thong (getAllDeclarations)
  - [x] Loc theo trang thai va nam
  - [x] Xuat Excel tong hop (admin only)
- [x] Tab 3: Bao cao tong the
  - [x] Tong so nguoi dung, khai bao, doanh thu thue
  - [x] Bieu do LineChart (doanh thu) + BarChart (so luong khai bao)
- [x] Tab 4: Cau hinh bieu thue
  - [x] Cap nhat muc giam tru ban than / nguoi phu thuoc
  - [x] Them/sua bieu thue theo nam (dong)
  - [x] Luu vao MongoDB qua TaxConfig model

### 4.3 Cau hinh he thong
- [x] API GET/PUT /api/config/tax-rules (dynamic TaxConfig)
- [x] Tinh thue ua tinh config tu DB cua tung nam cu the

### 4.4 Xuat du lieu
- [x] Xuat Excel danh sach khai bao (admin only, dung xlsx)
- [x] Xuat PDF phieu thue ca nhan (user, dung pdfkit + Arial font)
- [x] Kiem thu API xuat file: PDF + Excel + Phan quyen 403 (verify_export.js)

---

## PHASE 5 - HOAN THIEN & DEPLOY 🚧 DANG LAM
**Muc tieu**: San sang production, deploy len cloud

### 5.1 Validation & Error Handling
- [ ] Validate toan bo forms (client-side: required, format, range)
- [ ] Error boundaries (React) cho cac trang chinh
- [ ] Hien thi loi tu server thanh thong bao ro rang
- [ ] Xu ly truong hop token het han / mat ket noi

### 5.2 Responsive & UX
- [ ] Kiem tra responsive mobile (320px, 768px)
- [ ] Sidebar collapse tren man hinh nho
- [ ] Loading skeleton thay vi spinner don gian
- [ ] Empty states dep cho cac bang du lieu trong

### 5.3 Bao mat & Toi uu
- [ ] Rate limiting cho cac API nhay cam (login, register)
- [ ] Sanitize input (express-validator)
- [ ] Helmet headers kiem tra day du
- [ ] CORS chinh xac cho production URL

### 5.4 Tai lieu
- [ ] Viet API.md (tai lieu tat ca endpoints)
- [ ] Cap nhat README.md (huong dan cai dat & deploy)
- [ ] WORKFLOW.md (luong hoat dong he thong)

### 5.5 Testing
- [ ] Test E2E day du luong: Dang ky -> Khai bao -> Nop thue -> Bao cao
- [ ] Test Admin: Khoa user -> Xem khai bao -> Xuat Excel -> Chinh bieu thue
- [ ] Kiem tra tren trinh duyet: Chrome, Firefox, Edge

### 5.6 Deploy
- [ ] Chuyen doi .env.example thanh .env production
- [ ] Build production (npm run build)
- [ ] Deploy Backend len Render hoac Railway
- [ ] Ket noi MongoDB Atlas (thay the localhost)
- [ ] Deploy Frontend len Vercel hoac Netlify
- [ ] Kiem tra sau khi deploy

---

## VAN DE HIEN TAI
*(Ghi lai cac bug hoac diem can chu y)*

| STT | Van de | Trang thai | Ghi chu |
|-----|--------|------------|---------|
| 1 | TaxHistoryPage dung `taxYear` nhung schema dung `year` | ✅ Da sua | Sua cac fallback d.taxYear thanh d.year |
| 2 | Model Payment khong duoc dung trong payDeclaration | ✅ Da quyet dinh | Don gian hoa, cap nhat truc tiep TaxDeclaration |
| 3 | seed.js kiem tra TaxConfig nam 2026 thay vi 2024 | ✅ Da sua | Khoi tao cau hinh tu dong cho ca 3 nam 2024, 2025, 2026 |
| 4 | TaxHistoryPage crash vi sai cau truc API va thieu map array giam tru | ✅ Da sua | Set dung data.data, viet ham extract cac truong giam tru tu array va them status submitted |
| 5 | CORS tu choi ket noi tu browser local khi co slash/thay doi port | ✅ Da sua | Chuan hoa origin va cho phep cac port 3000/5000 |

---

## SESSION LOG

| Ngay | Viec da lam | Phase |
|------|-------------|-------|
| 2026-06-30 | Tao khung du an, cac file co ban, layout, auth, dashboard | Phase 0-2 |
| 2026-06-30 | TaxDeclarePage, TaxHistoryPage, PaymentModal, ProfilePage, TaxCalculator | Phase 3 |
| 2026-06-30 | ReportPage (Recharts), AdminPage (4 Tab), xuat PDF/Excel, TaxConfig dong | Phase 4 |
| 2026-06-30 | Commit: "admin panel, reports, tax config" (b0c660b) | Phase 4 ✅ |
| 2026-07-01 | Fix trang lich su khai bao, giam tru array mapping, loi CORS va seed.js | Phase 5.1/5.2 ✅ |

---

## LENH CHAY NHANH

```bash
# Chay du an (ca server + client)
npm run dev

# Chi chay server
npm run server

# Chi chay client
npm run client

# Cai dat lan dau
npm run install:all

# Tao du lieu mau
node server/src/utils/seed.js
```

## MUC TIEU SESSION TIEP THEO (PHASE 5)
- [ ] 5.1: Validate forms (required, format check, hien thi loi ro rang)
- [ ] 5.2: Responsive mobile + Loading skeleton + Empty states
- [ ] 5.3: Rate limiting + express-validator (bao mat)
- [ ] 5.4: Viet API.md + cap nhat README.md
- [ ] 5.5: Test E2E toan dien (trinh duyet)
- [ ] 5.6: Deploy (Render/Railway + MongoDB Atlas + Vercel/Netlify)
