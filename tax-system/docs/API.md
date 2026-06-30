# API Documentation - Hệ Thống Thuế TNCN

**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer Token (JWT) trong header `Authorization: Bearer <token>`

---

## 🔐 Auth Routes — `/api/auth`

> Rate-limited: tối đa 10 request/phút/IP

### POST `/api/auth/register`
Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "matkhau123",
  "phone": "0912345678",
  "idCard": "012345678901",
  "taxCode": "0123456789"
}
```

**Response 201:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "user" }
}
```

**Errors:** `400` Email đã tồn tại | `400` Validation error

---

### POST `/api/auth/login`
Đăng nhập.

**Request Body:**
```json
{ "email": "user@example.com", "password": "matkhau123" }
```

**Response 200:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": "...", "fullName": "...", "email": "...", "role": "user" }
}
```

**Errors:** `401` Sai email/mật khẩu | `403` Tài khoản bị khóa | `429` Quá nhiều yêu cầu

---

### GET `/api/auth/me` 🔒
Lấy thông tin người dùng đang đăng nhập.

---

## 👤 User Routes — `/api/users` 🔒

### GET `/api/users` 🔑 (Admin)
Lấy danh sách tất cả người dùng.

### PUT `/api/users/me`
Cập nhật thông tin cá nhân. Body: `{ fullName, phone, address, dateOfBirth }`

### PUT `/api/users/change-password`
Đổi mật khẩu. Body: `{ currentPassword, newPassword }`

### PUT `/api/users/:id/toggle-status` 🔑 (Admin)
Khóa / mở khóa tài khoản.

---

## 🧮 Tax Routes — `/api/tax` 🔒

### POST `/api/tax/calculate`
Tính thuế TNCN (không lưu DB).

**Request Body:**
```json
{
  "totalIncome": 50000000,
  "dependents": 2,
  "otherDeductions": 500000,
  "year": 2024
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000000,
    "personalDeduction": 11000000,
    "dependentDeduction": 8800000,
    "taxableIncome": 29700000,
    "taxAmount": 1485000,
    "effectiveRate": 2.97,
    "brackets": []
  }
}
```

---

### POST `/api/tax/declare`
Khai báo thuế và lưu vào DB.

**Request Body:**
```json
{
  "year": 2024,
  "declarationType": "annual",
  "incomes": [{ "source": "salary", "amount": 120000000 }],
  "deductions": [{ "type": "personal", "amount": 11000000 }]
}
```

`declarationType`: `"annual"` | `"monthly"`

---

### GET `/api/tax/declarations`
Danh sách tờ khai của user hiện tại.

### GET `/api/tax/declarations/:id`
Chi tiết một tờ khai.

### POST `/api/tax/declarations/:id/pay`
Nộp thuế. Body: `{ "paymentMethod": "internet_banking" }`

`paymentMethod`: `"bank_transfer"` | `"internet_banking"` | `"momo"` | `"vnpay"`

### GET `/api/tax/admin/declarations` 🔑 (Admin)
Toàn bộ tờ khai hệ thống.

---

## 📊 Report Routes — `/api/reports` 🔒

### GET `/api/reports/user`
Báo cáo thuế cá nhân theo năm.

### GET `/api/reports/summary` 🔑 (Admin)
Tổng quan hệ thống (tổng user, khai báo, thuế thu được).

### GET `/api/reports/export/pdf/:id`
Xuất PDF phiếu thuế cá nhân. Response: `application/pdf`

### GET `/api/reports/export/excel` 🔑 (Admin)
Xuất Excel toàn bộ khai báo. Response: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

---

## ⚙️ Config Routes — `/api/config` 🔒

### GET `/api/config/tax-rules`
Lấy biểu thuế theo năm. Query: `?year=2024`

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2024,
    "PERSONAL_DEDUCTION": 11000000,
    "DEPENDENT_DEDUCTION": 4400000,
    "TAX_BRACKETS": [
      { "min": 0,        "max": 5000000,  "rate": 5  },
      { "min": 5000000,  "max": 10000000, "rate": 10 },
      { "min": 10000000, "max": 18000000, "rate": 15 },
      { "min": 18000000, "max": 32000000, "rate": 20 },
      { "min": 32000000, "max": 52000000, "rate": 25 },
      { "min": 52000000, "max": 80000000, "rate": 30 },
      { "min": 80000000, "max": null,     "rate": 35 }
    ]
  }
}
```

### PUT `/api/config/tax-rules` 🔑 (Admin)
Cập nhật biểu thuế. Body: `{ year, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION, TAX_BRACKETS }`

---

## 🏥 Health Check

### GET `/api/health`
```json
{ "status": "OK", "message": "Tax System API is running" }
```

---

## Error Response Format

```json
{ "success": false, "message": "Mô tả lỗi bằng tiếng Việt" }
```

| Status | Ý nghĩa |
|--------|---------|
| `400` | Bad Request — Dữ liệu không hợp lệ |
| `401` | Unauthorized — Chưa đăng nhập / Token hết hạn |
| `403` | Forbidden — Không có quyền / Tài khoản bị khóa |
| `404` | Not Found — Không tìm thấy |
| `429` | Too Many Requests — Vượt rate limit |
| `500` | Internal Server Error |

> 🔒 = Yêu cầu đăng nhập (Bearer Token)  
> 🔑 = Chỉ Admin
