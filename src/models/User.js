import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String,},
    profilePic: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    token: {type: Number, default:0}
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
