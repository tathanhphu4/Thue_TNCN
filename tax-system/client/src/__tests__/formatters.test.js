import { formatCurrency, formatDate, getStatusLabel } from '../utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format number as VND currency', () => {
      const result = formatCurrency(1000000);
      // Vietnamese format uses dot as thousands separator
      expect(result).toContain('1.000.000');
      expect(result).toMatch(/₫|VND/); // contains VND symbol or text
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
    });

    it('should format large numbers', () => {
      const result = formatCurrency(100000000);
      expect(result).toContain('100.000.000');
    });

    it('should format small numbers', () => {
      const result = formatCurrency(500);
      expect(result).toContain('500');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-5000000);
      expect(result).toContain('5.000.000');
    });
  });

  describe('formatDate', () => {
    it('should format a date string in Vietnamese locale', () => {
      const result = formatDate('2024-06-15');
      // vi-VN format: dd/mm/yyyy
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should format ISO date string', () => {
      const result = formatDate('2024-01-01T00:00:00.000Z');
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle Date object-compatible strings', () => {
      const result = formatDate('2023-12-25');
      expect(result).toContain('2023');
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for draft status', () => {
      expect(getStatusLabel('draft')).toBe('Ban nhap');
    });

    it('should return correct label for submitted status', () => {
      expect(getStatusLabel('submitted')).toBe('Da khai bao');
    });

    it('should return correct label for paid status', () => {
      expect(getStatusLabel('paid')).toBe('Da nop thue');
    });

    it('should return correct label for overdue status', () => {
      expect(getStatusLabel('overdue')).toBe('Qua han');
    });

    it('should return correct label for cancelled status', () => {
      expect(getStatusLabel('cancelled')).toBe('Da huy');
    });

    it('should return the status itself for unknown statuses', () => {
      expect(getStatusLabel('unknown')).toBe('unknown');
      expect(getStatusLabel('processing')).toBe('processing');
    });

    it('should return undefined/falsy status as-is', () => {
      expect(getStatusLabel(undefined)).toBe(undefined);
    });
  });
});
