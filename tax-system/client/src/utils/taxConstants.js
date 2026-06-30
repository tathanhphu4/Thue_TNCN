export const PERSONAL_DEDUCTION  = 11000000;
export const DEPENDENT_DEDUCTION =  4400000;
export const INSURANCE_RATE      = 0.105; // BHXH 8% + BHYT 1.5% + BHTN 1%

export const TAX_BRACKETS = [
  { level: 1, min: 0,        max: 5000000,   rate: 0.05 },
  { level: 2, min: 5000000,  max: 10000000,  rate: 0.10 },
  { level: 3, min: 10000000, max: 18000000,  rate: 0.15 },
  { level: 4, min: 18000000, max: 32000000,  rate: 0.20 },
  { level: 5, min: 32000000, max: 52000000,  rate: 0.25 },
  { level: 6, min: 52000000, max: 80000000,  rate: 0.30 },
  { level: 7, min: 80000000, max: null,      rate: 0.35 },
];

export const calculateTax = ({ grossIncome, dependents, otherDeduction }) => {
  const insurance         = Math.round(grossIncome * INSURANCE_RATE);
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
  const taxableIncome     = Math.max(
    0,
    grossIncome - insurance - personalDeduction - dependentDeduction - otherDeduction
  );

  let taxAmount = 0;
  const bracketDetails = [];
  const activeBrackets = [];

  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.min) break;
    const upper = b.max ? Math.min(taxableIncome, b.max) : taxableIncome;
    const taxableInBracket = upper - b.min;
    const taxInBracket = Math.round(taxableInBracket * b.rate);
    taxAmount += taxInBracket;
    bracketDetails.push({
      level: b.level,
      rate: b.rate * 100,
      taxableInBracket,
      taxInBracket,
    });
    activeBrackets.push(b.level);
  }

  const netIncome = grossIncome - insurance - taxAmount;

  return {
    grossIncome,
    insurance,
    personalDeduction,
    dependentDeduction,
    otherDeduction,
    taxableIncome,
    taxAmount,
    netIncome,
    bracketDetails,
    activeBrackets,
  };
};

export const computeDeclarationTax = (incomes, deductions) => {
  const totalIncome = incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const dep = deductions.find(d => d.type === 'dependent');
  const dependents = dep?.dependents || 0;
  const insurance = Number(deductions.find(d => d.type === 'insurance')?.amount || 0);
  const charity   = Number(deductions.find(d => d.type === 'charity')?.amount || 0);
  const other     = Number(deductions.find(d => d.type === 'other')?.amount || 0);

  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
  const totalDeduction = PERSONAL_DEDUCTION + (insurance || Math.round(totalIncome * INSURANCE_RATE)) + dependentDeduction + charity + other;
  const taxableIncome = Math.max(0, totalIncome - totalDeduction);

  let taxAmount = 0;
  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.min) break;
    const upper = b.max ? Math.min(taxableIncome, b.max) : taxableIncome;
    taxAmount += Math.round((upper - b.min) * b.rate);
  }

  const netIncome = totalIncome - (insurance || Math.round(totalIncome * INSURANCE_RATE)) - taxAmount;

  return { totalIncome, personalDeduction: PERSONAL_DEDUCTION, dependentDeduction, totalDeduction, taxableIncome, taxAmount, netIncome };
};
