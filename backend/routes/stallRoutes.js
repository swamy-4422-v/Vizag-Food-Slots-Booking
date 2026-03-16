const express = require('express');
const router = express.Router();
const { 
  getNearbyStalls, 
  createStall, 
  getAllStalls,
  getStallById,
  updateStall,
  deleteStall,
  searchStalls
} = require('../controllers/stallController');

const { protect, admin } = require('../middleware/auth');

// --- PUBLIC ROUTES ---
router.get('/nearby', getNearbyStalls);
router.get('/search', searchStalls);
router.get('/', getAllStalls);
router.get('/:id', getStallById);

// --- ADMIN ROUTES ---
router.post('/', protect, admin, createStall);
router.put('/:id', protect, admin, updateStall);
router.delete('/:id', protect, admin, deleteStall);

module.exports = router;