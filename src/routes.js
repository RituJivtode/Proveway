const express = require('express');
const { downloadVideo, uploadVideoChunk } = require('./controllers/driveController');
const errorHandler = require('./middleware/errorHandler');

const router = express.Router();

router.get('/download/:fileId', downloadVideo);

router.post('/upload/:fileId', uploadVideoChunk);

router.use(errorHandler);

module.exports = router;
