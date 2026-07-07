import AdminSettings from '../models/AdminSettings.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';
import { getAdminMetrics } from '../services/analyticsService.js';

export const getSystemSettings = async (req, res, next) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSystemSettings = async (req, res, next) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsReport = async (req, res, next) => {
  try {
    const report = await getAdminMetrics();
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// Coupon Management
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const exists = await Coupon.findOne({ code: req.body.code });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Coupon code already registered' });
    }
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  const { id } = req.params; // here we match by code or database id
  try {
    await Coupon.deleteOne({ _id: id });
    res.json({ success: true, message: 'Coupon removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Customer & Restaurant management
export const toggleUserStatus = async (req, res, next) => {
  const { id } = req.params;
  const { active } = req.body;
  try {
    const user = await User.findOneAndUpdate({ id }, { $set: { active } }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
