import mongoose from 'mongoose';

// Define the Transactions schema
const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['purchase', 'generation'], required: true }, // "purchase" or "generation"
    amount: { type: Number, required: true },
    paymentDetails: { type: Object }, // Store payment response for purchases
    createdAt: { type: Date, default: Date.now }
  }
);

// Create the Transactions model
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
