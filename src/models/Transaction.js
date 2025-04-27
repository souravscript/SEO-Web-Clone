import mongoose from 'mongoose';

// Define the Transactions schema
const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['purchase', 'generation'], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number },
    balanceBefore: { type: Number },
    paymentDetails: { type: Object }, // Store payment response for purchases
    documentDetails: { // Details for document generation transactions
      type: {
        title: { type: String },
        type: { type: String, default: 'blog' },
        timestamp: { type: Date },
        jobId: { type: String }
      },
      required: false
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes for better query performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });

// Virtual for token balance after transaction
transactionSchema.virtual('balanceAfter').get(function() {
  // This will be populated when needed by aggregating previous transactions
  return this._balanceAfter;
});

// Create the Transactions model
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
