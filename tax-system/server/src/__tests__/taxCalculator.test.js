/**
 * Unit Test cho tính thuế thu nhập cá nhân
 * Nhóm 10 – TaxVN
 */

const { calculateTax, calculateTaxableIncome } = require('../utils/taxCalculator');

// ─────────────────────────────────────────────────
// calculateTaxableIncome
// ─────────────────────────────────────────────────
describe('calculateTaxableIncome', () => {
  const PERSONAL_DEDUCTION  = 11000000;
  const DEPENDENT_DEDUCTION =  4400000;

  test('UT-01: Thu nhập dưới mức giảm trừ cá nhân → trả 0', () => {
    const result = calculateTaxableIncome({
      totalIncome: 8000000,
      personalDeduction: PERSONAL_DEDUCTION,
      dependents: 0,
      dependentDeduction: DEPENDENT_DEDUCTION,
      otherDeductions: 0,
    });
    expect(result).toBe(0);
  });

  test('UT-02: Có người phụ thuộc và giảm trừ khác → trả đúng tổng sau giảm trừ', () => {
    // 20tr - 11tr (cá nhân) - 4.4tr (1 phụ thuộc) - 1tr (khác) = 3.6tr
    const result = calculateTaxableIncome({
      totalIncome: 20000000,
      personalDeduction: PERSONAL_DEDUCTION,
      dependents: 1,
      dependentDeduction: DEPENDENT_DEDUCTION,
      otherDeductions: 1000000,
    });
    expect(result).toBe(3600000);
  });
});

// ─────────────────────────────────────────────────
// calculateTax
// ─────────────────────────────────────────────────
describe('calculateTax', () => {
  test('UT-03: taxableIncome = 0 → totalTax = 0, brackets rỗng', () => {
    const { totalTax, brackets } = calculateTax(0);
    expect(totalTax).toBe(0);
    expect(brackets).toEqual([]);
  });

  test('UT-04: taxableIncome = 5.000.000 (đúng biên bậc 1) → 250.000đ', () => {
    // Bậc 1: 0–5tr @ 5% → 5.000.000 * 5% = 250.000
    const { totalTax } = calculateTax(5000000);
    expect(totalTax).toBe(250000);
  });

  test('UT-05: taxableIncome qua nhiều bậc → tổng và chi tiết từng bậc đúng', () => {
    // 20.000.000:
    //   Bậc 1: 5tr @ 5%  = 250.000
    //   Bậc 2: 5tr @ 10% = 500.000
    //   Bậc 3: 8tr @ 15% = 1.200.000
    //   Bậc 4: 2tr @ 20% = 400.000
    //   Total = 2.350.000
    const { totalTax, brackets } = calculateTax(20000000);
    expect(totalTax).toBe(2350000);
    expect(brackets.length).toBe(4);
    expect(brackets[0]).toMatchObject({ rate: 5,  amount: 5000000, taxOnBracket: 250000 });
    expect(brackets[1]).toMatchObject({ rate: 10, amount: 5000000, taxOnBracket: 500000 });
    expect(brackets[2]).toMatchObject({ rate: 15, amount: 8000000, taxOnBracket: 1200000 });
    expect(brackets[3]).toMatchObject({ rate: 20, amount: 2000000, taxOnBracket: 400000 });
  });

  test('UT-06: taxableIncome > 80tr (bậc không giới hạn) → tính đúng phần trên 80tr', () => {
    // 100.000.000:
    //   Bậc 1:  5tr @ 5%  = 250.000
    //   Bậc 2:  5tr @ 10% = 500.000
    //   Bậc 3:  8tr @ 15% = 1.200.000
    //   Bậc 4: 14tr @ 20% = 2.800.000
    //   Bậc 5: 20tr @ 25% = 5.000.000
    //   Bậc 6: 28tr @ 30% = 8.400.000
    //   Bậc 7: 20tr @ 35% = 7.000.000
    //   Total = 25.150.000
    const { totalTax, brackets } = calculateTax(100000000);
    expect(totalTax).toBe(25150000);
    expect(brackets.length).toBe(7);
    expect(brackets[6]).toMatchObject({ rate: 35, amount: 20000000, taxOnBracket: 7000000 });
  });

  test('UT-07: Custom brackets → dùng cấu hình truyền vào, không dùng bậc mặc định', () => {
    const customBrackets = [
      { min: 0,          max: 10000000, rate: 10 },
      { min: 10000000,   max: null,     rate: 20 },
    ];
    // taxableIncome = 15.000.000:
    //   10tr @ 10% = 1.000.000
    //    5tr @ 20% = 1.000.000
    //   Total = 2.000.000
    const { totalTax, brackets } = calculateTax(15000000, customBrackets);
    expect(totalTax).toBe(2000000);
    expect(brackets.length).toBe(2);
  });
});
