const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// http://localhost:3001/api/user
router.use('/user', userRoutes);
// http://localhost:3001/api/thought
router.use('/thought', thoughtRoutes);

module.exports = router;