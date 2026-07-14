import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import LoginLog from '../models/LoginLog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecoeats_jwt_secret_key_2026';

export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      // Record a failed signup attempt due to email already registered
      await LoginLog.create({
        email,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
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

    // Initialize user wallet with registered email
    await Wallet.create({
      holderId: userId,
      holderEmail: user.email,
      holderType: user.role === 'restaurant' ? 'restaurant' : user.role === 'admin' ? 'platform' : user.role === 'delivery' ? 'delivery' : 'customer',
      coinBalance: 0,
      fiatBalance: 0
    });

    // Record successful signup/login
    await LoginLog.create({
      email: user.email,
      userId: user.id,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
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
      // Record failed login due to unknown email
      await LoginLog.create({
        email,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Record failed login due to incorrect password
      await LoginLog.create({
        email: user.email,
        userId: user.id,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Record successful login
    await LoginLog.create({
      email: user.email,
      userId: user.id,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

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
