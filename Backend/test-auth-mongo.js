import dns from 'dns';
import 'dotenv/config';
import mongoose from 'mongoose';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) { }

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models/User.js';

const MONGODB_URL = 'mongodb+srv://rudraknit81_db_user:Rudra321@cluster0.zftzymb.mongodb.net/giveaway';

async function runTest() {
  console.log('1. Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('✓ Connected to MongoDB');

  const testEmail = `test_${Date.now()}@veloop.test`;
  const testUsername = `user_${Date.now()}`;
  const testPassword = 'Password123!';

  console.log('2. Creating new user with password hashing...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testPassword, salt);

  const newUser = new User({
    username: testUsername,
    email: testEmail,
    password: hashedPassword,
    enteredGiveaways: [],
  });
  await newUser.save();
  console.log(`✓ User saved to MongoDB with ID: ${newUser._id}`);

  console.log('3. Verifying stored user in MongoDB...');
  const foundUser = await User.findOne({ email: testEmail });
  if (!foundUser) throw new Error('User not found in MongoDB!');
  const passwordValid = await bcrypt.compare(testPassword, foundUser.password);
  if (!passwordValid) throw new Error('Password verification failed!');
  console.log('✓ Found user in MongoDB and password verified with bcrypt');

  console.log('4. Entering a giveaway for this user in MongoDB...');
  foundUser.enteredGiveaways.push({
    giveawayId: 'hero-general',
    prizeName: 'Exclusive Giveaway Entry',
    entryRequirement: 'Free entry',
    enteredAt: new Date(),
  });
  await foundUser.save();

  const userWithEntry = await User.findById(newUser._id);
  if (userWithEntry.enteredGiveaways.length !== 1) {
    throw new Error('Giveaway entry was not recorded in MongoDB!');
  }
  console.log('✓ Giveaway entry verified in MongoDB:', userWithEntry.enteredGiveaways[0]);

  console.log('5. Cleaning up test user...');
  await User.deleteOne({ _id: newUser._id });
  console.log('✓ Test user cleaned up');

  await mongoose.disconnect();
  console.log('🎉 ALL TESTS PASSED! Authentication & MongoDB integration works flawlessly!');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

