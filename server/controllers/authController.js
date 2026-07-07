import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecoeats_jwt_secret_key_2026';

export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const userId = `user-${Date.now()}`;
    const user = new User({
      id: userId,
      name,
      email,
      password,
      role: role || 'customer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`
    });

    await user.save();

    // Initialize user wallet
    await Wallet.create({
      holderId: userId,
      holderType: user.role === 'restaurant' ? 'restaurant' : user.role === 'admin' ? 'platform' : 'customer',
      coinBalance: 0,
      fiatBalance: 0
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, token, user: userObj });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, token, user: userObj });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const wallet = await Wallet.findOne({ holderId: user.id });
    
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({
      success: true,
      user: userObj,
      wallet: {
        coins: wallet?.coinBalance || 0,
        fiat: wallet?.fiatBalance || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const { savedAddresses, ecoPoints, name, avatar } = req.body;
  try {
    const updateFields = {};
    if (savedAddresses !== undefined) updateFields.savedAddresses = savedAddresses;
    if (ecoPoints !== undefined) updateFields.ecoPoints = ecoPoints;
    if (name !== undefined) updateFields.name = name;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $set: updateFields },
      { new: true }
    );

    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (error) {
    next(error);
  }
};
