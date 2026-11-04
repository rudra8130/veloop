import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  enteredGiveaways: [
    {
      giveawayId: {
        type: String,
        required: true,
      },
      prizeName: {
        type: String,
        default: 'General Giveaway',
      },
      entryRequirement: {
        type: String,
        default: 'Free entry',
      },
      enteredAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isWinner: {
    type: Boolean,
    default: false,
  },
  wonPrizes: [
    {
      giveawayId: {
        type: String,
        default: 'g1',
      },
      prizeName: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        default: '1st Prize',
      },
      art: {
        type: String,
        default: 'phone',
      },
      claimStatus: {
        type: String,
        enum: ['not_submitted', 'submitted', 'processing', 'completed', 'expired'],
        default: 'not_submitted',
      },
      claimDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      wonAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
