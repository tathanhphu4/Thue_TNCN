/**
 * Unit Test cho controllers/reportController.js
 * Nhóm 10 – TaxVN
 */

const { getSystemSummary, getUserReport } = require('../controllers/reportController');
const User = require('../models/User');
const TaxDeclaration = require('../models/TaxDeclaration');

jest.mock('../models/User');
jest.mock('../models/TaxDeclaration');

describe('Report Controller - getSystemSummary', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('UT-REPORT-01: Admin lấy tổng quan hệ thống thành công', async () => {
    User.countDocuments.mockResolvedValue(5);
    TaxDeclaration.countDocuments.mockResolvedValue(10);
    TaxDeclaration.aggregate.mockResolvedValue([{ _id: null, total: 15000000 }]);

    await getSystemSummary(req, res);

    expect(User.countDocuments).toHaveBeenCalledWith({ role: 'user' });
    expect(TaxDeclaration.countDocuments).toHaveBeenCalled();
    expect(TaxDeclaration.aggregate).toHaveBeenCalledWith([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$taxAmount' } } }
    ]);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        totalUsers: 5,
        totalDeclarations: 10,
        totalTaxCollected: 15000000
      }
    });
  });

  test('UT-REPORT-02: Tổng thuế thu được trả về 0 nếu chưa có tờ khai nộp thành công', async () => {
    User.countDocuments.mockResolvedValue(2);
    TaxDeclaration.countDocuments.mockResolvedValue(4);
    TaxDeclaration.aggregate.mockResolvedValue([]); // Rỗng khi không có match status: 'paid'

    await getSystemSummary(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        totalUsers: 2,
        totalDeclarations: 4,
        totalTaxCollected: 0
      }
    });
  });

  test('UT-REPORT-03: Lỗi kết nối DB khi lấy tổng quan hệ thống -> 500', async () => {
    User.countDocuments.mockRejectedValue(new Error('Database error'));

    await getSystemSummary(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database error'
    });
  });
});

describe('Report Controller - getUserReport', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('UT-REPORT-04: Lấy báo cáo cá nhân thành công không lọc theo năm', async () => {
    const mockDeclarations = [
      { year: 2026, month: 7, taxAmount: 500000 },
      { year: 2026, month: 6, taxAmount: 300000 }
    ];

    TaxDeclaration.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockDeclarations)
    });

    await getUserReport(req, res);

    expect(TaxDeclaration.find).toHaveBeenCalledWith({ user: 'user123' });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        declarations: mockDeclarations,
        totalTax: 800000
      }
    });
  });

  test('UT-REPORT-05: Lấy báo cáo cá nhân thành công có lọc theo năm cụ thể', async () => {
    req.query.year = '2025';
    const mockDeclarations = [
      { year: 2025, month: 12, taxAmount: 1200000 }
    ];

    const sortMock = jest.fn().mockResolvedValue(mockDeclarations);
    TaxDeclaration.find.mockReturnValue({
      sort: sortMock
    });

    await getUserReport(req, res);

    expect(TaxDeclaration.find).toHaveBeenCalledWith({ user: 'user123', year: 2025 });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        declarations: mockDeclarations,
        totalTax: 1200000
      }
    });
  });

  test('UT-REPORT-06: Lỗi kết nối DB khi lấy báo cáo cá nhân -> 500', async () => {
    TaxDeclaration.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('Query error'))
    });

    await getUserReport(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Query error'
    });
  });
});
