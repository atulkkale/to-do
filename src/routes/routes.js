const router = require('express').Router();
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/auth', authRoutes);
router.use('/task', taskRoutes);

module.exports = router;
