// Biểu thuế TNCN lũy tiến từng phần (Việt Nam 2024)
// Áp dụng cho thu nhập từ tiền lương, tiền công
const TAX_BRACKETS = [
  { min: 0,          max: 5000000,   rate: 5  },
  { min: 5000000,    max: 10000000,  rate: 10 },
  { min: 10000000,   max: 18000000,  rate: 15 },
  { min: 18000000,   max: 32000000,  rate: 20 },
  { min: 32000000,   max: 52000000,  rate: 25 },
  { min: 52000000,   max: 80000000,  rate: 30 },
  { min: 80000000,   max: null,      rate: 35 },
];

const PERSONAL_DEDUCTION  = 11000000; // 11 triệu/tháng
const DEPENDENT_DEDUCTION =  4400000; // 4.4 triệu/tháng/người

module.exports = { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION };
