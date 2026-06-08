const express = require('express');
const router = express.Router();

const authorRoutes = require('./authorRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');

// Montar sub-rutas
router.use('/authors', authorRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
