# TaxVN - He Thong Tinh Thue Thu Nhap Ca Nhan

He thong quan ly va tinh thue thu nhap ca nhan (TNCN) theo phap luat Viet Nam.

## Cong nghe su dung

| Tang | Cong nghe |
|------|-----------|
| Frontend | React 18, JSX, React Router v6 |
| Styling | CSS thuan (khong framework) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Token) |
| Export | xlsx, pdfkit |

## Cau truc du an

```
tax-system/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── auth/        # Login, Register forms
│       │   ├── dashboard/   # Dashboard widgets
│       │   ├── tax/         # Tax forms, calculator
│       │   ├── reports/     # Charts, export
│       │   ├── admin/       # Admin panels
│       │   └── shared/      # Layout, PrivateRoute, common UI
│       ├── pages/           # Page-level components
│       ├── context/         # AuthContext
│       ├── hooks/           # Custom hooks
│       ├── services/        # API calls (axios)
│       ├── utils/           # formatters, helpers
│       └── styles/          # CSS files
│
├── server/                  # Express backend
│   └── src/
│       ├── config/          # DB, tax rules
│       ├── controllers/     # Business logic
│       ├── middleware/       # Auth, error handling
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API routes
│       └── utils/           # Tax calculator
│
├── docs/                    # Documentation
│   ├── PROGRESS.md          # Tien do du an
│   ├── API.md               # API documentation
│   └── WORKFLOW.md          # Workflow & architecture
│
├── package.json             # Root scripts
└── .gitignore
```

## Nhom chuc nang

### Nhom 1: Nguoi dung
- Dang ky / Dang nhap tai khoan
- Cap nhat ho so ca nhan (ma so thue, CCCD)
- **Tinh thue nhanh**: nhap thu nhap -> xem ket qua ngay
- **Khai bao thue**: nhap day du thu nhap, giam tru, luu ho so
- **Nop thue**: xac nhan va danh dau da nop
- Xem lich su khai bao
- Xuat PDF, in phieu thue

### Nhom 2: Quan tri vien
- Quan ly danh sach nguoi dung
- Xem / duyet cac to khai thue
- Bao cao tong hop: doanh thu thue, so nguoi nop
- Cau hinh bieu thue, muc giam tru
- Xuat bao cao Excel

## Quy tac tinh thue TNCN

Ap dung bieu thue luy tien tung phan (Luat Thue TNCN Viet Nam):

| Bac | Thu nhap tinh thue/thang | Thue suat |
|-----|--------------------------|-----------|
| 1 | Den 5 trieu | 5% |
| 2 | 5 - 10 trieu | 10% |
| 3 | 10 - 18 trieu | 15% |
| 4 | 18 - 32 trieu | 20% |
| 5 | 32 - 52 trieu | 25% |
| 6 | 52 - 80 trieu | 30% |
| 7 | Tren 80 trieu | 35% |

**Giam tru gia canh:**
- Ban than: 11.000.000 VND/thang
- Nguoi phu thuoc: 4.400.000 VND/nguoi/thang

## Cai dat

### Yeu cau he thong
- Node.js >= 18.x
- MongoDB >= 6.x
- npm >= 9.x

### Cai dat va chay

```bash
# 1. Clone du an
git clone <repo-url>
cd tax-system

# 2. Cai dat dependencies
npm run install:all

# 3. Cau hinh bien moi truong
cd server
cp .env.example .env
# Chinh sua .env voi thong tin cua ban

# 4. Chay du an (ca frontend + backend)
cd ..
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## API Endpoints

### Auth
| Method | URL | Mo ta |
|--------|-----|-------|
| POST | /api/auth/register | Dang ky |
| POST | /api/auth/login | Dang nhap |
| GET | /api/auth/me | Thong tin ca nhan |

### Tax
| Method | URL | Mo ta |
|--------|-----|-------|
| POST | /api/tax/calculate | Tinh thue (khong luu) |
| POST | /api/tax/declare | Khai bao thue |
| GET | /api/tax/declarations | Danh sach khai bao |
| GET | /api/tax/declarations/:id | Chi tiet khai bao |

### Reports
| Method | URL | Mo ta | Role |
|--------|-----|-------|------|
| GET | /api/reports/user | Bao cao ca nhan | user |
| GET | /api/reports/summary | Tong quan he thong | admin |

## Tien do

Xem file `docs/PROGRESS.md` de biet tinh trang cu the cua tung tinh nang.

## Dong gop

1. Tao branch moi: `git checkout -b feature/ten-tinh-nang`
2. Commit: `git commit -m "feat: mo ta ngan gon"`
3. Push va tao Pull Request

## Luu y phat trien

- Tat ca tinh nang co duoi `.jsx` (React components)
- Goi API tap trung qua `src/services/`
- State quan ly qua React Context (khong dung Redux)
- CSS viet rieng cho tung module, khong dung framework
