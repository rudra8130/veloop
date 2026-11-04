import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dns from 'dns';
import { fileURLToPath } from 'url';
import path from 'path';
import { User } from './models/User.js';
import { Claim } from './models/Claim.js';
import { authenticateToken } from './middleware/auth.js';

// Resolve DNS SRV query issues on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from current directory or Frontend directory
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URL) {
  dotenv.config({ path: path.join(__dirname, '..', 'Frontend', '.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'veloop_rewards_secret_jwt_key_2026_super_secure';
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://rudraknit81_db_user:Rudra321@cluster0.zftzymb.mongodb.net/giveaway';

// Middleware
app.use(cors({
  origin: 'https://veloop-sigma.vercel.app/',
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
console.log('Connecting to MongoDB at:', MONGODB_URL.replace(/:([^:@]+)@/, ':****@'));
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ----------------- Auth Routes ----------------- //

// Register / Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
      return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in MongoDB
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      enteredGiveaways: [],
      isWinner: false,
      wonPrizes: [],
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        enteredGiveaways: newUser.enteredGiveaways,
        isWinner: newUser.isWinner,
        wonPrizes: newUser.wonPrizes,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide both username/email and password.' });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Search by either username or email
    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        enteredGiveaways: user.enteredGiveaways,
        isWinner: user.isWinner || (user.wonPrizes && user.wonPrizes.length > 0),
        wonPrizes: user.wonPrizes || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// Get Current Logged-in User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        enteredGiveaways: user.enteredGiveaways,
        isWinner: user.isWinner || (user.wonPrizes && user.wonPrizes.length > 0),
        wonPrizes: user.wonPrizes || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// ----------------- Giveaway Entry Routes ----------------- //

// Enter a Giveaway
app.post('/api/giveaways/enter', authenticateToken, async (req, res) => {
  try {
    const { giveawayId, prizeName, entryRequirement } = req.body;

    if (!giveawayId) {
      return res.status(400).json({ message: 'Giveaway ID is required.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user already entered this giveaway
    const alreadyEntered = user.enteredGiveaways.some((g) => g.giveawayId === giveawayId);
    if (alreadyEntered) {
      return res.status(400).json({ message: 'You have already entered this giveaway!' });
    }

    // Add entry
    user.enteredGiveaways.push({
      giveawayId,
      prizeName: prizeName || 'Giveaway Entry',
      entryRequirement: entryRequirement || 'Free entry',
      enteredAt: new Date(),
    });

    await user.save();

    return res.status(200).json({
      message: 'Entry confirmed! Your ticket is registered in the draw.',
      enteredGiveaways: user.enteredGiveaways,
    });
  } catch (error) {
    console.error('Error entering giveaway:', error);
    return res.status(500).json({ message: 'Failed to record entry in MongoDB.' });
  }
});

// Get User's Entered Giveaways
app.get('/api/giveaways/my-entries', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      enteredGiveaways: user ? user.enteredGiveaways : [],
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return res.status(500).json({ message: 'Failed to retrieve entries.' });
  }
});

// ----------------- Prize Claim Routes (Secure MongoDB Storage) ----------------- //

// Submit a Prize Claim
app.post('/api/claims/submit', authenticateToken, async (req, res) => {
  try {
    const {
      giveawayId,
      prizeName,
      position,
      art,
      prizeType,
      shippingDetails,
      digitalDeliveryEmail,
    } = req.body;

    if (!prizeName) {
      return res.status(400).json({ message: 'Prize name is required.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isDigital = prizeType === 'digital' || /gift\s*card|amazon/i.test(prizeName) || art === 'giftcard';

    // Strict validation
    if (isDigital) {
      if (!digitalDeliveryEmail || !/^\S+@\S+\.\S+$/.test(digitalDeliveryEmail.trim())) {
        return res.status(400).json({ message: 'Please provide a valid delivery email address for your gift card.' });
      }
    } else {
      if (!shippingDetails) {
        return res.status(400).json({ message: 'Complete delivery details are required.' });
      }
      const { fullName, phone, address, city, state, pinCode } = shippingDetails;
      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ message: 'Full name is required.' });
      }
      if (!phone || !/^\d{10}$/.test(phone.trim())) {
        return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number.' });
      }
      if (!address || !address.trim()) {
        return res.status(400).json({ message: 'Complete delivery address is required.' });
      }
      if (!city || !city.trim() || !state || !state.trim()) {
        return res.status(400).json({ message: 'City and State are required.' });
      }
      if (!pinCode || !/^\d{6}$/.test(pinCode.trim())) {
        return res.status(400).json({ message: 'Please provide a valid 6-digit PIN code.' });
      }
    }

    // Save claim securely in MongoDB Claim collection
    const newClaim = new Claim({
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      giveawayId: giveawayId || 'g1',
      prizeName,
      position: position || '1st Prize',
      prizeType: isDigital ? 'digital' : 'physical',
      shippingDetails: isDigital
        ? {}
        : {
          fullName: shippingDetails.fullName.trim(),
          phone: shippingDetails.phone.trim(),
          address: shippingDetails.address.trim(),
          city: shippingDetails.city.trim(),
          state: shippingDetails.state.trim(),
          pinCode: shippingDetails.pinCode.trim(),
        },
      digitalDeliveryEmail: isDigital ? digitalDeliveryEmail.trim().toLowerCase() : undefined,
      claimStatus: 'submitted',
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      submittedAt: new Date(),
    });

    await newClaim.save();

    // Update user's won prize status in User collection
    let prizeFound = false;
    if (user.wonPrizes && user.wonPrizes.length > 0) {
      for (const p of user.wonPrizes) {
        if (p.prizeName === prizeName || p.giveawayId === giveawayId) {
          p.claimStatus = 'submitted';
          p.claimDetails = {
            claimId: newClaim._id,
            submittedAt: newClaim.submittedAt,
            prizeType: newClaim.prizeType,
          };
          prizeFound = true;
          break;
        }
      }
    }

    if (!prizeFound) {
      user.wonPrizes.push({
        giveawayId: giveawayId || 'g1',
        prizeName,
        position: position || '1st Prize',
        art: art || (isDigital ? 'giftcard' : 'phone'),
        claimStatus: 'submitted',
        claimDetails: {
          claimId: newClaim._id,
          submittedAt: newClaim.submittedAt,
          prizeType: newClaim.prizeType,
        },
        wonAt: new Date(),
      });
    }

    user.isWinner = true;
    await user.save();

    console.log(`[CLAIM STORED SECURELY IN MONGODB] User: ${user.username}, Prize: ${prizeName}, ID: ${newClaim._id}`);

    return res.status(201).json({
      message: 'Claim received and securely stored in MongoDB!',
      claim: newClaim,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isWinner: user.isWinner,
        wonPrizes: user.wonPrizes,
      },
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    return res.status(500).json({ message: 'Internal server error while saving claim.' });
  }
});

// Get User's Claims
app.get('/api/claims/my-claims', authenticateToken, async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user._id }).sort({ submittedAt: -1 });
    return res.status(200).json({ claims });
  } catch (error) {
    console.error('Error retrieving claims:', error);
    return res.status(500).json({ message: 'Failed to retrieve claims.' });
  }
});

// Set / Toggle winner status (Convenient for testing winner flow)
app.post('/api/user/set-winner', authenticateToken, async (req, res) => {
  try {
    const { isWinner, prizeName, position, giveawayId, art } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (isWinner === false) {
      user.isWinner = false;
      user.wonPrizes = [];
    } else {
      user.isWinner = true;
      if (!user.wonPrizes || user.wonPrizes.length === 0) {
        user.wonPrizes = [
          {
            giveawayId: giveawayId || 'g1',
            prizeName: prizeName || 'iPhone 15 Pro',
            position: position || '1st Prize',
            art: art || 'phone',
            claimStatus: 'not_submitted',
            wonAt: new Date(),
          },
        ];
      }
    }

    await user.save();

    return res.status(200).json({
      message: user.isWinner ? 'User is now marked as a Winner!' : 'Winner status reset.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isWinner: user.isWinner,
        wonPrizes: user.wonPrizes,
      },
    });
  } catch (error) {
    console.error('Error toggling winner status:', error);
    return res.status(500).json({ message: 'Failed to update winner status.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`VELOOP Backend server running on port ${PORT}`);
});
