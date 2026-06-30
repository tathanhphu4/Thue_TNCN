const { calculateTax, calculateTaxableIncome } = require('../../src/utils/taxCalculator');
const { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../../src/config/taxRules');

describe('taxCalculator', () => {
  describe('calculateTaxableIncome', () => {
    it('should return 0 when totalIncome is less than personal deduction', () => {
      const result = calculateTaxableIncome({
        totalIncome: 5000000,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 0,
        dependentDeduction: DEPENDENT_DEDUCTION,
        otherDeductions: 0,
      });
      expect(result).toBe(0);
    });

    it('should return correct taxable income with no dependents', () => {
      const result = calculateTaxableIncome({
        totalIncome: 20000000,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 0,
        dependentDeduction: DEPENDENT_DEDUCTION,
        otherDeductions: 0,
      });
      // 20,000,000 - 11,000,000 = 9,000,000
      expect(result).toBe(9000000);
    });

    it('should subtract dependent deductions correctly', () => {
      const result = calculateTaxableIncome({
        totalIncome: 30000000,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 2,
        dependentDeduction: DEPENDENT_DEDUCTION,
        otherDeductions: 0,
      });
      // 30,000,000 - 11,000,000 - (2 * 4,400,000) = 10,200,000
      expect(result).toBe(10200000);
    });

    it('should subtract other deductions', () => {
      const result = calculateTaxableIncome({
        totalIncome: 25000000,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 0,
        dependentDeduction: DEPENDENT_DEDUCTION,
        otherDeductions: 2000000,
      });
      // 25,000,000 - 11,000,000 - 2,000,000 = 12,000,000
      expect(result).toBe(12000000);
    });

    it('should never return negative values', () => {
      const result = calculateTaxableIncome({
        totalIncome: 1000000,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 3,
        dependentDeduction: DEPENDENT_DEDUCTION,
        otherDeductions: 5000000,
      });
      expect(result).toBe(0);
    });

    it('should handle zero income', () => {
      const result = calculateTaxableIncome({
        totalIncome: 0,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 0,
        dependentDeduction: DEPENDENT_DEDUCTION,
        otherDeductions: 0,
      });
      expect(result).toBe(0);
    });

    it('should default otherDeductions to 0 when not provided', () => {
      const result = calculateTaxableIncome({
        totalIncome: 20000000,
        personalDeduction: PERSONAL_DEDUCTION,
        dependents: 0,
        dependentDeduction: DEPENDENT_DEDUCTION,
      });
      expect(result).toBe(9000000);
    });
  });

  describe('calculateTax', () => {
    it('should return 0 tax for 0 or negative taxable income', () => {
      expect(calculateTax(0)).toEqual({ totalTax: 0, brackets: [] });
      expect(calculateTax(-1000000)).toEqual({ totalTax: 0, brackets: [] });
    });

    it('should calculate tax for income in bracket 1 only (up to 5M)', () => {
      const result = calculateTax(3000000);
      expect(result.totalTax).toBe(150000); // 3,000,000 * 5%
      expect(result.brackets).toHaveLength(1);
      expect(result.brackets[0].rate).toBe(5);
      expect(result.brackets[0].amount).toBe(3000000);
      expect(result.brackets[0].taxOnBracket).toBe(150000);
    });

    it('should calculate tax at exactly 5M (bracket 1 boundary)', () => {
      const result = calculateTax(5000000);
      expect(result.totalTax).toBe(250000); // 5,000,000 * 5%
      expect(result.brackets).toHaveLength(1);
    });

    it('should calculate tax spanning bracket 1 and 2', () => {
      const result = calculateTax(8000000);
      // Bracket 1: 5,000,000 * 5% = 250,000
      // Bracket 2: 3,000,000 * 10% = 300,000
      // Total: 550,000
      expect(result.totalTax).toBe(550000);
      expect(result.brackets).toHaveLength(2);
    });

    it('should calculate tax spanning all 7 brackets (100M)', () => {
      const result = calculateTax(100000000);
      // Bracket 1: 5,000,000 * 5% = 250,000
      // Bracket 2: 5,000,000 * 10% = 500,000
      // Bracket 3: 8,000,000 * 15% = 1,200,000
      // Bracket 4: 14,000,000 * 20% = 2,800,000
      // Bracket 5: 20,000,000 * 25% = 5,000,000
      // Bracket 6: 28,000,000 * 30% = 8,400,000
      // Bracket 7: 20,000,000 * 35% = 7,000,000
      // Total: 25,150,000
      expect(result.totalTax).toBe(25150000);
      expect(result.brackets).toHaveLength(7);
    });

    it('should calculate tax at exactly bracket 6 boundary (80M)', () => {
      const result = calculateTax(80000000);
      // Bracket 1: 5,000,000 * 5% = 250,000
      // Bracket 2: 5,000,000 * 10% = 500,000
      // Bracket 3: 8,000,000 * 15% = 1,200,000
      // Bracket 4: 14,000,000 * 20% = 2,800,000
      // Bracket 5: 20,000,000 * 25% = 5,000,000
      // Bracket 6: 28,000,000 * 30% = 8,400,000
      // Total: 18,150,000
      expect(result.totalTax).toBe(18150000);
      expect(result.brackets).toHaveLength(6);
    });

    it('should use custom brackets when provided', () => {
      const customBrackets = [
        { min: 0, max: 10000000, rate: 10 },
        { min: 10000000, max: null, rate: 20 },
      ];
      const result = calculateTax(15000000, customBrackets);
      // Bracket 1: 10,000,000 * 10% = 1,000,000
      // Bracket 2: 5,000,000 * 20% = 1,000,000
      // Total: 2,000,000
      expect(result.totalTax).toBe(2000000);
      expect(result.brackets).toHaveLength(2);
    });

    it('should fall back to default brackets when customBrackets is empty array', () => {
      const result = calculateTax(5000000, []);
      expect(result.totalTax).toBe(250000); // Same as default bracket 1
    });

    it('should fall back to default brackets when customBrackets is null', () => {
      const result = calculateTax(5000000, null);
      expect(result.totalTax).toBe(250000);
    });

    it('should round the total tax to integer', () => {
      // Use a custom bracket that produces a fractional result
      const customBrackets = [
        { min: 0, max: null, rate: 7 },
      ];
      const result = calculateTax(1000001, customBrackets);
      // 1,000,001 * 7% = 70,000.07 -> rounded to 70000
      expect(Number.isInteger(result.totalTax)).toBe(true);
    });

    it('should handle income exactly at bracket minimum (no tax for that bracket)', () => {
      // Income of exactly 5,000,000 should not trigger bracket 2
      const result = calculateTax(5000000);
      expect(result.brackets).toHaveLength(1);
      expect(result.brackets[0].rate).toBe(5);
    });
  });

  describe('taxRules constants', () => {
    it('should have 7 tax brackets', () => {
      expect(TAX_BRACKETS).toHaveLength(7);
    });

    it('should have brackets in ascending order', () => {
      for (let i = 1; i < TAX_BRACKETS.length; i++) {
        expect(TAX_BRACKETS[i].min).toBeGreaterThan(TAX_BRACKETS[i - 1].min);
      }
    });

    it('should have last bracket with max = null (unlimited)', () => {
      expect(TAX_BRACKETS[TAX_BRACKETS.length - 1].max).toBeNull();
    });

    it('should have contiguous brackets (each max equals next min)', () => {
      for (let i = 0; i < TAX_BRACKETS.length - 1; i++) {
        expect(TAX_BRACKETS[i].max).toBe(TAX_BRACKETS[i + 1].min);
      }
    });

    it('should have correct deduction amounts', () => {
      expect(PERSONAL_DEDUCTION).toBe(11000000);
      expect(DEPENDENT_DEDUCTION).toBe(4400000);
    });

    it('should have rates between 5 and 35', () => {
      TAX_BRACKETS.forEach(bracket => {
        expect(bracket.rate).toBeGreaterThanOrEqual(5);
        expect(bracket.rate).toBeLessThanOrEqual(35);
      });
    });
  });
});
