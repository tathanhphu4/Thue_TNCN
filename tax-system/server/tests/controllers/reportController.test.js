const { getSystemSummary, getUserReport } = require('../../src/controllers/reportController');

jest.mock('../../src/models/TaxDeclaration');
jest.mock('../../src/models/User');

const TaxDeclaration = require('../../src/models/TaxDeclaration');
const User = require('../../src/models/User');

describe('reportController', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, params: {}, user: { _id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getSystemSummary', () => {
    it('should return system summary with correct counts', async () => {
      User.countDocuments.mockResolvedValue(50);
      TaxDeclaration.countDocuments.mockResolvedValue(120);
      TaxDeclaration.aggregate.mockResolvedValue([{ _id: null, total: 500000000 }]);

      await getSystemSummary(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalUsers: 50,
          totalDeclarations: 120,
          totalTaxCollected: 500000000,
        },
      });
    });

    it('should return 0 totalTaxCollected if no paid declarations', async () => {
      User.countDocuments.mockResolvedValue(10);
      TaxDeclaration.countDocuments.mockResolvedValue(5);
      TaxDeclaration.aggregate.mockResolvedValue([]);

      await getSystemSummary(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalUsers: 10,
          totalDeclarations: 5,
          totalTaxCollected: 0,
        },
      });
    });

    it('should return 500 on error', async () => {
      User.countDocuments.mockRejectedValue(new Error('DB error'));

      await getSystemSummary(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUserReport', () => {
    it('should return user declarations and total tax', async () => {
      const mockDeclarations = [
        { _id: 'dec1', taxAmount: 1000000 },
        { _id: 'dec2', taxAmount: 2000000 },
      ];
      TaxDeclaration.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockDeclarations) });

      await getUserReport(req, res);

      expect(TaxDeclaration.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          declarations: mockDeclarations,
          totalTax: 3000000,
        },
      });
    });

    it('should filter by year when provided', async () => {
      req.query.year = '2024';
      TaxDeclaration.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

      await getUserReport(req, res);

      expect(TaxDeclaration.find).toHaveBeenCalledWith({ user: 'user123', year: 2024 });
    });

    it('should return empty data when no declarations', async () => {
      TaxDeclaration.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

      await getUserReport(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { declarations: [], totalTax: 0 },
      });
    });

    it('should return 500 on error', async () => {
      TaxDeclaration.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });

      await getUserReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
