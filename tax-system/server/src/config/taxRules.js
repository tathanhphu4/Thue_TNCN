const TAX_BRACKETS = [
  { min: 0,          max: 5000000,   rate: 5  },
  { min: 5000000,    max: 10000000,  rate: 10 },
  { min: 10000000,   max: 18000000,  rate: 15 },
  { min: 18000000,   max: 32000000,  rate: 20 },
  { min: 32000000,   max: 52000000,  rate: 25 },
  { min: 52000000,   max: 80000000,  rate: 30 },
  { min: 80000000,   max: null,      rate: 35 },
];

const PERSONAL_DEDUCTION  = 11000000;
const DEPENDENT_DEDUCTION =  4400000;

module.exports = { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION };
