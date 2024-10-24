const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  blockHeight: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
