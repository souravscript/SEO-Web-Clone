import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String,},
    supabaseId:{type: String, required: true, unique: true},
    profilePic: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    phoneNumber: { type: String, default: '' },
    token: {type: Number, default:0}
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
