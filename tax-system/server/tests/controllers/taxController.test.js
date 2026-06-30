const { calculate, declare, getDeclarations, getDeclaration, payDeclaration, getAllDeclarations } = require('../../src/controllers/taxController');

jest.mock('../../src/models/TaxDeclaration');
jest.mock('../../src/models/TaxConfig');

const TaxDeclaration = require('../../src/models/TaxDeclaration');
const TaxConfig = require('../../src/models/TaxConfig');

describe('taxController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { _id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('calculate', () => {
    it('should calculate tax with default rules (no config found)', async () => {
      req.body = { totalIncome: 20000000, dependents: 0, otherDeductions: 0, year: 2024 };
      TaxConfig.findOne.mockResolvedValue(null);

      await calculate(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          totalIncome: 20000000,
          taxableIncome: 9000000,
          totalTax: expect.any(Number),
          brackets: expect.any(Array),
        }),
      }));
    });

    it('should calculate tax with custom config from DB', async () => {
      req.body = { totalIncome: 30000000, dependents: 1, otherDeductions: 0, year: 2024 };
      TaxConfig.findOne.mockResolvedValue({
        personalDeduction: 12000000,
        dependentDeduction: 5000000,
        taxBrackets: [
          { min: 0, max: 10000000, rate: 5 },
          { min: 10000000, max: null, rate: 10 },
        ],
      });

      await calculate(req, res);

      // taxableIncome = 30,000,000 - 12,000,000 - 5,000,000 = 13,000,000
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          taxableIncome: 13000000,
        }),
      }));
    });

    it('should default dependents to 0 and otherDeductions to 0', async () => {
      req.body = { totalIncome: 15000000 };
      TaxConfig.findOne.mockResolvedValue(null);

      await calculate(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          totalIncome: 15000000,
          taxableIncome: 4000000, // 15M - 11M = 4M
        }),
      }));
    });

    it('should return 500 on server error', async () => {
      req.body = { totalIncome: 20000000 };
      TaxConfig.findOne.mockRejectedValue(new Error('DB error'));

      await calculate(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
      }));
    });
  });

  describe('declare', () => {
    it('should create a tax declaration successfully', async () => {
      req.body = {
        year: 2024,
        month: 6,
        declarationType: 'monthly',
        incomes: [
          { source: 'salary', amount: 25000000, description: 'Luong' },
        ],
        deductions: [
          { type: 'dependent', dependents: 1, amount: 4400000 },
          { type: 'insurance', amount: 2000000 },
        ],
      };
      TaxConfig.findOne.mockResolvedValue(null);
      const mockDeclaration = { _id: 'dec123', ...req.body, status: 'pending' };
      TaxDeclaration.create.mockResolvedValue(mockDeclaration);

      await declare(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(TaxDeclaration.create).toHaveBeenCalledWith(expect.objectContaining({
        user: 'user123',
        year: 2024,
        month: 6,
        status: 'pending',
      }));
    });

    it('should handle deductions with no dependent type', async () => {
      req.body = {
        year: 2024,
        month: 3,
        declarationType: 'monthly',
        incomes: [{ source: 'salary', amount: 20000000 }],
        deductions: [{ type: 'insurance', amount: 1000000 }],
      };
      TaxConfig.findOne.mockResolvedValue(null);
      TaxDeclaration.create.mockResolvedValue({ _id: 'dec123' });

      await declare(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 on error', async () => {
      req.body = {
        year: 2024,
        month: 1,
        declarationType: 'monthly',
        incomes: [{ source: 'salary', amount: 20000000 }],
        deductions: [],
      };
      TaxConfig.findOne.mockResolvedValue(null);
      TaxDeclaration.create.mockRejectedValue(new Error('DB error'));

      await declare(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getDeclarations', () => {
    it('should return all declarations for the current user', async () => {
      const mockDeclarations = [
        { _id: 'dec1', year: 2024, month: 1 },
        { _id: 'dec2', year: 2024, month: 2 },
      ];
      TaxDeclaration.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockDeclarations) });

      await getDeclarations(req, res);

      expect(TaxDeclaration.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockDeclarations,
      });
    });

    it('should return 500 on error', async () => {
      TaxDeclaration.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });

      await getDeclarations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getDeclaration', () => {
    it('should return a specific declaration', async () => {
      req.params.id = 'dec123';
      const mockDeclaration = { _id: 'dec123', year: 2024 };
      TaxDeclaration.findOne.mockResolvedValue(mockDeclaration);

      await getDeclaration(req, res);

      expect(TaxDeclaration.findOne).toHaveBeenCalledWith({ _id: 'dec123', user: 'user123' });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockDeclaration });
    });

    it('should return 404 if declaration not found', async () => {
      req.params.id = 'nonexistent';
      TaxDeclaration.findOne.mockResolvedValue(null);

      await getDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on error', async () => {
      req.params.id = 'dec123';
      TaxDeclaration.findOne.mockRejectedValue(new Error('DB error'));

      await getDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('payDeclaration', () => {
    it('should return 400 if no paymentMethod provided', async () => {
      req.params.id = 'dec123';
      req.body = {};

      await payDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if declaration not found', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'bank_transfer' };
      TaxDeclaration.findOne.mockResolvedValue(null);

      await payDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if declaration already paid', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'bank_transfer' };
      TaxDeclaration.findOne.mockResolvedValue({ _id: 'dec123', status: 'paid' });

      await payDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if declaration in invalid status (cancelled)', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'bank_transfer' };
      TaxDeclaration.findOne.mockResolvedValue({ _id: 'dec123', status: 'cancelled' });

      await payDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should successfully pay a pending declaration', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'bank_transfer' };
      const mockDeclaration = {
        _id: 'dec123',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true),
      };
      TaxDeclaration.findOne.mockResolvedValue(mockDeclaration);

      await payDeclaration(req, res);

      expect(mockDeclaration.status).toBe('paid');
      expect(mockDeclaration.paymentMethod).toBe('bank_transfer');
      expect(mockDeclaration.paidAt).toBeInstanceOf(Date);
      expect(mockDeclaration.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockDeclaration });
    });

    it('should successfully pay a submitted declaration', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'credit_card' };
      const mockDeclaration = {
        _id: 'dec123',
        status: 'submitted',
        save: jest.fn().mockResolvedValue(true),
      };
      TaxDeclaration.findOne.mockResolvedValue(mockDeclaration);

      await payDeclaration(req, res);

      expect(mockDeclaration.status).toBe('paid');
      expect(mockDeclaration.paymentMethod).toBe('credit_card');
    });

    it('should successfully pay an overdue declaration', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'e_wallet' };
      const mockDeclaration = {
        _id: 'dec123',
        status: 'overdue',
        save: jest.fn().mockResolvedValue(true),
      };
      TaxDeclaration.findOne.mockResolvedValue(mockDeclaration);

      await payDeclaration(req, res);

      expect(mockDeclaration.status).toBe('paid');
    });

    it('should return 500 on server error', async () => {
      req.params.id = 'dec123';
      req.body = { paymentMethod: 'bank_transfer' };
      TaxDeclaration.findOne.mockRejectedValue(new Error('DB error'));

      await payDeclaration(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllDeclarations', () => {
    it('should return all declarations (admin)', async () => {
      const mockDeclarations = [{ _id: 'dec1' }, { _id: 'dec2' }];
      TaxDeclaration.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockDeclarations),
        }),
      });

      await getAllDeclarations(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockDeclarations });
    });

    it('should return 500 on error', async () => {
      TaxDeclaration.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('DB error')),
        }),
      });

      await getAllDeclarations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
