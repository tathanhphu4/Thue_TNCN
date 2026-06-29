const mongoose = require('mongoose');

// Bảng biểu thuế suất lũy tiến (theo pháp luật Việt Nam)
const taxBracketSchema = new mongoose.Schema({
  min:  { type: Number, required: true },
  max:  { type: Number },          // null = không giới hạn
  rate: { type: Number, required: true }, // Phần trăm
});

const taxConfigSchema = new mongoose.Schema({
  year:               { type: Number, required: true, unique: true },
  personalDeduction:  { type: Number, default: 11000000 },  // Giảm trừ bản thân (11tr/tháng)
  dependentDeduction: { type: Number, default: 4400000 },   // Giảm trừ người phụ thuộc (4.4tr/tháng)
  taxBrackets:        [taxBracketSchema],
  isActive:           { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TaxConfig', taxConfigSchema);
