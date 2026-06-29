const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  declaration:    { type: mongoose.Schema.Types.ObjectId, ref: 'TaxDeclaration', required: true },
  amount:         { type: Number, required: true },
  method:         { type: String, enum: ['bank_transfer', 'online', 'cash'], required: true },
  transactionId:  { type: String },
  status:         { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paidAt:         { type: Date },
  note:           { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
