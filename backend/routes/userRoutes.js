const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  findUsers,
  checkPub,
  updateUsername,
  getUser,
} = require('../controllers/userControllers');

const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/chat', protect, getUsers);
router.get('/:searchWord', findUsers);
router.get('/get/:id', getUser);
router.get('/:pubId', checkPub);
router.post('/settings', protect, updateUsername);

module.exports = router;
