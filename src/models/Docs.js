import mongoose from 'mongoose';

// Define the Docs schema
const docSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    docType: {type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    isPublished: {type: Boolean, default:false}
  },
  { timestamps: true }
);

// Create the Docs model
const Docs = mongoose.models.Docs || mongoose.model('Docs', docSchema);

export default Docs;
