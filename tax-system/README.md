# 🏛️ TaxVN — Hệ Thống Quản Lý Thuế Thu Nhập Cá Nhân

Hệ thống khai báo và quản lý thuế TNCN trực tuyến theo pháp luật Việt Nam.

## ✨ Tính năng chính

### 👤 Người dùng
| Tính năng | Mô tả |
|-----------|-------|
| 🔐 Đăng ký / Đăng nhập | Xác thực JWT, validate đầy đủ client & server |
| 🧮 Máy tính thuế | Tính thuế lũy tiến tức thì, hiển thị từng bậc |
| 📝 Khai báo thuế | Form động nhiều nguồn thu nhập, nhiều loại giảm trừ |
| 💳 Nộp thuế | Modal 3 bước, 4 phương thức thanh toán |
| 📋 Lịch sử khai báo | Filter trạng thái/năm, expand chi tiết |
| 📊 Báo cáo cá nhân | Biểu đồ Recharts AreaChart + BarChart, tải PDF |
| 👤 Hồ sơ cá nhân | Cập nhật thông tin + đổi mật khẩu bảo mật |

### 🔑 Quản trị viên
| Tính năng | Mô tả |
|-----------|-------|
| 👥 Quản lý người dùng | Danh sách, tìm kiếm, khóa/mở khóa tài khoản |
| 📋 Quản lý tờ khai | Xem toàn bộ hệ thống, lọc trạng thái/năm |
| 📥 Xuất Excel | Tải xuống danh sách tờ khai .xlsx |
| 📈 Thống kê hệ thống | Tổng user, khai báo, doanh thu; biểu đồ theo năm |
| ⚙️ Cấu hình biểu thuế | Chỉnh mức giảm trừ và bậc thuế suất theo năm |

## 🛠️ Công nghệ

| Tầng | Công nghệ |
|------|-----------|
| Frontend | React 18 (JSX), React Router v6, Recharts |
| Styling | Vanilla CSS (không framework) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| Bảo mật | Helmet, CORS, express-rate-limit, express-validator |
| Export | xlsx, pdfkit (font Arial tiếng Việt) |

## 🚀 Cài đặt & Chạy local

### Yêu cầu
- Node.js ≥ 18.x
- MongoDB ≥ 6.x (chạy local hoặc dùng MongoDB Atlas)
- npm ≥ 9.x

### Cài đặt

```bash
# 1. Clone project
git clone https://github.com/tathanhphu4/Thue_TNCN.git
cd Thue_TNCN/tax-system

# 2. Cài đặt tất cả dependencies
npm run install:all

# 3. Cấu hình backend
cd server
cp .env.example .env
# Mở .env và chỉnh sửa:
#   MONGODB_URI=mongodb://localhost:27017/tax_system
#   JWT_SECRET=<chuỗi ngẫu nhiên dài ≥32 ký tự>
cd ..

# 4. Tạo dữ liệu mẫu (admin + user mẫu + biểu thuế 2024)
node server/src/utils/seed.js

# 5. Chạy hệ thống
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

### Tài khoản mẫu

| Role | Email | Mật khẩu |
|------|-------|---------|
| Admin | admin@taxvn.com | Admin@123 |
| User | user@taxvn.com | User@123 |

## 🌐 Deploy lên Production

### Backend (Render / Railway)

1. Kết nối GitHub repo với Render/Railway
2. Chọn thư mục gốc là `tax-system/`
3. Cài đặt Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tax_system
   JWT_SECRET=<strong-random-secret>
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
4. Build command: `npm run install:all`
5. Start command: `node server/src/index.js`

### Frontend (Vercel / Netlify)

1. Import GitHub repo vào Vercel
2. Root directory: `tax-system/client`
3. Build command: `npm run build`
4. Output dir: `build`
5. Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```
6. Cấu hình Rewrites (SPA): `/* → /index.html`

## 📋 Lệnh tiện ích

```bash
# Chạy cả client + server (development)
npm run dev

# Chỉ server
npm run server

# Chỉ client
npm run client

# Cài tất cả packages
npm run install:all

# Tạo dữ liệu mẫu
node server/src/utils/seed.js

# Build production client
cd client && npm run build
```

## 📁 Cấu trúc thư mục

```
tax-system/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/shared/  # Layout, ErrorBoundary, EmptyState...
│       ├── context/            # AuthContext
│       ├── pages/              # LoginPage, DashboardPage, AdminPage...
│       ├── services/           # API calls (axios)
│       ├── styles/             # CSS modules
│       └── utils/              # formatters
│
├── server/                     # Express backend
│   └── src/
│       ├── config/             # DB connection, tax rules
│       ├── controllers/        # Business logic
│       ├── middleware/         # JWT auth, adminOnly
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API routes
│       └── utils/              # Tax calculator, seed
│
├── docs/
│   ├── API.md                  # Tài liệu API đầy đủ
│   ├── WORKFLOW.md             # Luồng hoạt động hệ thống
│   └── PROGRESS.md            # Tiến độ dự án
│
├── Procfile                    # Deploy Render/Railway
├── package.json                # Root scripts
└── .gitignore
```

## 📐 Biểu thuế TNCN 2024

| Bậc | Thu nhập tính thuế/tháng | Thuế suất |
|-----|--------------------------|-----------|
| 1 | Đến 5 triệu | 5% |
| 2 | 5 – 10 triệu | 10% |
| 3 | 10 – 18 triệu | 15% |
| 4 | 18 – 32 triệu | 20% |
| 5 | 32 – 52 triệu | 25% |
| 6 | 52 – 80 triệu | 30% |
| 7 | Trên 80 triệu | 35% |

**Giảm trừ gia cảnh:** Bản thân 11.000.000 VNĐ/tháng | Người phụ thuộc 4.400.000 VNĐ/tháng

> Biểu thuế có thể cấu hình động qua Admin Panel theo từng năm.

## 📄 Tài liệu

- [API Documentation](./docs/API.md)
- [System Workflow](./docs/WORKFLOW.md)
- [Tiến độ dự án](./docs/PROGRESS.md)
