import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  giveawayId: {
    type: String,
    default: 'g1',
  },
  prizeName: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    default: '1st Prize',
  },
  prizeType: {
    type: String,
    enum: ['physical', 'digital'],
    default: 'physical',
  },
  // Physical prize shipping info (sanitized and validated)
  shippingDetails: {
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pinCode: { type: String, trim: true },
  },
  // Digital gift card recipient email
  digitalDeliveryEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  claimStatus: {
    type: String,
    enum: ['submitted', 'processing', 'completed', 'expired'],
    default: 'submitted',
  },
  ipAddress: {
    type: String,
    default: '',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Claim = mongoose.model('Claim', claimSchema);

