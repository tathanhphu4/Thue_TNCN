const mongoose = require('mongoose');

// Chi tiết thu nhập
const incomeSchema = new mongoose.Schema({
  source:       { type: String, enum: ['salary', 'business', 'investment', 'other'], required: true },
  description:  { type: String },
  amount:       { type: Number, required: true, min: 0 },
});

// Chi tiết giảm trừ
const deductionSchema = new mongoose.Schema({
  type:         { type: String, enum: ['personal', 'dependent', 'insurance', 'charity', 'other'] },
  description:  { type: String },
  amount:       { type: Number, default: 0 },
  dependents:   { type: Number, default: 0 }, // Số người phụ thuộc
});

const taxDeclarationSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year:           { type: Number, required: true },
  month:          { type: Number, min: 1, max: 12 }, // null = khai báo năm
  declarationType:{ type: String, enum: ['monthly', 'annual'], required: true },

  // Thu nhập
  incomes:        [incomeSchema],
  totalIncome:    { type: Number, default: 0 },

  // Giảm trừ
  deductions:     [deductionSchema],
  totalDeduction: { type: Number, default: 0 },

  // Tính thuế
  taxableIncome:  { type: Number, default: 0 }, // Thu nhập chịu thuế
  taxAmount:      { type: Number, default: 0 },  // Số thuế phải nộp
  taxBrackets:    [{ rate: Number, amount: Number, taxOnBracket: Number }],

  // Trạng thái
  status: {
    type: String,
    enum: ['draft', 'submitted', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  submittedAt:    { type: Date },
  paidAt:         { type: Date },
  dueDate:        { type: Date },
  notes:          { type: String },
}, { timestamps: true });

module.exports = mongoose.model('TaxDeclaration', taxDeclarationSchema);
