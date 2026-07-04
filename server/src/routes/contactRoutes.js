const express = require('express');
const { validateContact, submitContact } = require('../controllers/contactController');

const router = express.Router();

router.post('/', validateContact, submitContact);

module.exports = router;
