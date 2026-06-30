const { TAX_BRACKETS } = require('../config/taxRules');

/**
 * Tính thuế TNCN theo phương pháp lũy tiến từng phần
 * @param {number} taxableIncome - Thu nhập tính thuế (sau giảm trừ)
 * @returns {{ totalTax: number, brackets: Array }}
 */
const calculateTax = (taxableIncome, customBrackets = null) => {
  if (taxableIncome <= 0) return { totalTax: 0, brackets: [] };

  let totalTax = 0;
  const brackets = [];
  const activeBrackets = customBrackets && customBrackets.length > 0 ? customBrackets : TAX_BRACKETS;

  for (const bracket of activeBrackets) {
    if (taxableIncome <= bracket.min) break;

    const upper    = bracket.max !== null ? bracket.max : Infinity;
    const taxable  = Math.min(taxableIncome, upper) - bracket.min;
    const taxOnBracket = taxable * (bracket.rate / 100);

    brackets.push({ rate: bracket.rate, amount: taxable, taxOnBracket });
    totalTax += taxOnBracket;
  }

  return { totalTax: Math.round(totalTax), brackets };
};

/**
 * Tính thu nhập tính thuế
 */
const calculateTaxableIncome = ({ totalIncome, personalDeduction, dependents, dependentDeduction, otherDeductions = 0 }) => {
  const dependentTotal = dependents * dependentDeduction;
  const totalDeduction = personalDeduction + dependentTotal + otherDeductions;
  return Math.max(0, totalIncome - totalDeduction);
};

module.exports = { calculateTax, calculateTaxableIncome };
