import express from 'express';
import { 
  getWalletData, 
  getCoinHistory, 
  redeemCoins, 
  earnCoins, 
  getRewardSettings, 
  updateRewardSettings,
  getRewardStats,
  convertCoinsToMoney
} from '../controllers/rewardController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Wallet endpoints
router.get('/wallet', requireAuth, getWalletData);
router.get('/wallet/history', requireAuth, getCoinHistory);
router.get('/history', requireAuth, getCoinHistory); // Compatibility fallback

// Transactions
router.post('/wallet/redeem', requireAuth, redeemCoins);
router.post('/redeem', requireAuth, redeemCoins); // Compatibility fallback

router.post('/wallet/convert', requireAuth, convertCoinsToMoney);

router.post('/wallet/earn', requireAuth, earnCoins);
router.post('/earn', requireAuth, earnCoins); // Compatibility fallback

// Admin Reward Settings and reports
router.get('/reward/settings', requireAuth, getRewardSettings);
router.get('/settings', requireAuth, getRewardSettings); // Compatibility fallback

router.put('/reward/settings', requireAdmin, updateRewardSettings);
router.put('/settings', requireAdmin, updateRewardSettings); // Compatibility fallback

// Admin Dashboard stats
router.get('/admin/stats', requireAdmin, getRewardStats);

export default router;
