# API DOCUMENTATION

## Base URL
- Dev: http://localhost:5000/api
- Tat ca protected routes can header: Authorization: Bearer <jwt_token>

## Auth Routes

### POST /auth/register
Body: { fullName, email, password, phone?, idNumber? }
Response: { success, token, user }

### POST /auth/login
Body: { email, password }
Response: { success, token, user }

### GET /auth/me [Protected]
Response: { success, user }

## Tax Routes [Protected]

### POST /tax/calculate
Body: { totalIncome, dependents, otherDeductions }
Response: { success, data: { totalIncome, taxableIncome, totalTax, brackets } }

### POST /tax/declare
Body: { year, month?, declarationType, incomes[], deductions[] }

### GET /tax/declarations
Response: { success, data: [...declarations] }

### GET /tax/declarations/:id
Response: { success, data: declaration }

## Report Routes [Protected]

### GET /reports/user?year=2024
Response: { success, data: { declarations, totalTax } }

### GET /reports/summary [Admin only]
Response: { success, data: { totalUsers, totalDeclarations, totalTaxCollected } }

## Status Codes
- 200: OK
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
