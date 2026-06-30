const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  source:       { type: String, enum: ['salary', 'business', 'investment', 'other'], required: true },
  description:  { type: String },
  amount:       { type: Number, required: true, min: 0 },
});

const deductionSchema = new mongoose.Schema({
  type:         { type: String, enum: ['personal', 'dependent', 'insurance', 'charity', 'other'] },
  description:  { type: String },
  amount:       { type: Number, default: 0 },
  dependents:   { type: Number, default: 0 },
});

const taxDeclarationSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year:           { type: Number, required: true },
  month:          { type: Number, min: 1, max: 12 },
  declarationType:{ type: String, enum: ['monthly', 'annual'], required: true },

  incomes:        [incomeSchema],
  totalIncome:    { type: Number, default: 0 },

  deductions:     [deductionSchema],
  totalDeduction: { type: Number, default: 0 },

  taxableIncome:  { type: Number, default: 0 },
  taxAmount:      { type: Number, default: 0 },
  taxBrackets:    [{ rate: Number, amount: Number, taxOnBracket: Number }],

  status: {
    type: String,
    enum: ['draft', 'pending', 'submitted', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  submittedAt:    { type: Date },
  paidAt:         { type: Date },
  paymentMethod: { type: String },
  dueDate:        { type: Date },
  notes:          { type: String },
}, { timestamps: true });

module.exports = mongoose.model('TaxDeclaration', taxDeclarationSchema);
