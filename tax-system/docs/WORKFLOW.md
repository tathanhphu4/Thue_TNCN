# WORKFLOW & KIEN TRUC HE THONG

## Luong xac thuc (Auth Flow)
1. User dang nhap -> POST /api/auth/login
2. Server tra ve JWT token
3. Client luu token vao localStorage
4. Moi request gui kem header: Authorization: Bearer <token>
5. Middleware auth.js kiem tra token truoc khi vao controller

## Luong tinh thue
1. User nhap thu nhap va cac khoan giam tru
2. Client goi POST /api/tax/calculate
3. taxCalculator.js tinh: Thu nhap tinh thue = Thu nhap - Giam tru gia canh
4. Ap dung bieu thue luy tien tung phan
5. Tra ve ket qua chi tiet tung bac thue

## Luong khai bao thue
1. User dien form -> POST /api/tax/declare
2. Server tinh thue tu dong va luu TaxDeclaration (status: submitted)
3. User vao lich su, bam "Nop thue"
4. POST /api/payments -> cap nhat status: paid

## Phan quyen
- user: chi xem du lieu cua chinh minh
- admin: xem tat ca + cau hinh he thong

## Data flow
Client -> services/*.js -> api.js (axios) -> Express Routes -> Controllers -> Models -> MongoDB
