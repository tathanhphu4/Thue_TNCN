import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const BRACKETS = [
  { level: 1, min: 0,        max: 5000000,   rate: 5  },
  { level: 2, min: 5000000,  max: 10000000,  rate: 10 },
  { level: 3, min: 10000000, max: 18000000,  rate: 15 },
  { level: 4, min: 18000000, max: 32000000,  rate: 20 },
  { level: 5, min: 32000000, max: 52000000,  rate: 25 },
  { level: 6, min: 52000000, max: 80000000,  rate: 30 },
  { level: 7, min: 80000000, max: null,      rate: 35 },
];

const TaxBracketTable = ({ activeBrackets = [] }) => {
  return (
    <div className="bracket-table-wrapper">
      <h3 className="bracket-title">Biểu thuế lũy tiến 2024</h3>
      <table className="bracket-table">
        <thead>
          <tr>
            <th>Bậc</th>
            <th>Thu nhập tính thuế/tháng</th>
            <th>Thuế suất</th>
          </tr>
        </thead>
        <tbody>
          {BRACKETS.map((b) => {
            const isActive = activeBrackets.includes(b.level);
            return (
              <tr key={b.level} className={isActive ? 'bracket-active' : ''}>
                <td className="bracket-level">{b.level}</td>
                <td>
                  {formatCurrency(b.min)}
                  {b.max ? ` – ${formatCurrency(b.max)}` : ' trở lên'}
                </td>
                <td className="bracket-rate">{b.rate}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="bracket-note">
        * Giảm trừ bản thân: <strong>11.000.000đ/tháng</strong> &nbsp;|&nbsp;
        Người phụ thuộc: <strong>4.400.000đ/người/tháng</strong>
      </p>
    </div>
  );
};

export default TaxBracketTable;