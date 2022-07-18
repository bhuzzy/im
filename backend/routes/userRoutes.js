const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  findUsers,
  checkPub,
} = require('../controllers/userControllers');

const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/chat', protect, getUsers);
router.get('/:searchWord', findUsers);
router.get('/:pubId', checkPub);

module.exports = router;
