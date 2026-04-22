import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'staff', 'patient', 'doctor'], required: true },
    isActive: { type: Boolean, default: true },
    stripeCustomerId: { type: String, unique: true, sparse: true },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
      },
      status: {
        type: String,
        enum: ['inactive', 'active', 'past_due', 'canceled'],
        default: 'inactive'
      },
      aiFeaturesEnabled: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
