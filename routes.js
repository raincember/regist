const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser } = require('./handler');

const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('photo'), registerUser);

module.exports = router;
