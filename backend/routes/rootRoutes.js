const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/rootControllers');

const { protect } = require('../middleware/authMiddleware');

router.get('/:Id', getUser);

module.exports = router;
