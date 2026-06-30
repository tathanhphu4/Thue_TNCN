const mongoose = require('mongoose');

const taxBracketSchema = new mongoose.Schema({
  min:  { type: Number, required: true },
  max:  { type: Number },
  rate: { type: Number, required: true },
});

const taxConfigSchema = new mongoose.Schema({
  year:               { type: Number, required: true, unique: true },
  personalDeduction:  { type: Number, default: 11000000 },
  dependentDeduction: { type: Number, default: 4400000 },
  taxBrackets:        [taxBracketSchema],
  isActive:           { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TaxConfig', taxConfigSchema);
