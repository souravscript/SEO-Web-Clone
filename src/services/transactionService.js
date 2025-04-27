import connectToDatabase from '@/db/db-connect';
import Transaction from '@/models/Transaction';

export class TransactionService {
    static async createGenerationTransaction(userId, amount, documentDetails) {
        try {
            await connectToDatabase();
            
            const transaction = await Transaction.create({
                userId,
                type: 'generation',
                amount: -amount, // Negative amount for deductions
                documentDetails: {
                    title: documentDetails.title,
                    type: documentDetails.type || 'blog',
                    timestamp: new Date(),
                    jobId: documentDetails.jobId
                }
            });

            return transaction;
        } catch (error) {
            console.error('Error creating generation transaction:', error);
            throw new Error('Failed to create generation transaction');
        }
    }

    static async getUserTransactions(userId, options = {}) {
        try {
            await connectToDatabase();
            
            const query = { userId };
            const { type, startDate, endDate, limit = 10, page = 1 } = options;
            
            if (type) {
                query.type = type;
            }
            
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = new Date(startDate);
                if (endDate) query.createdAt.$lte = new Date(endDate);
            }

            const skip = (page - 1) * limit;
            
            const [transactions, total] = await Promise.all([
                Transaction.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Transaction.countDocuments(query)
            ]);

            return {
                transactions,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: page,
                    limit
                }
            };
        } catch (error) {
            console.error('Error fetching user transactions:', error);
            throw new Error('Failed to fetch user transactions');
        }
    }

    static async getTransactionStats(userId) {
        try {
            await connectToDatabase();
            
            const stats = await Transaction.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }},
                { $project: {
                    type: '$_id',
                    totalAmount: 1,
                    count: 1,
                    _id: 0
                }}
            ]);

            return stats;
        } catch (error) {
            console.error('Error fetching transaction stats:', error);
            throw new Error('Failed to fetch transaction stats');
        }
    }
}
