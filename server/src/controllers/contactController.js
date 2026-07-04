const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const { sendContactNotification } = require('../utils/sendEmail');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

const submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, subject, message } = req.body;

    const savedMessage = await Message.create({ name, email, subject, message });

    try {
      await sendContactNotification({ name, email, subject, message });
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
    }

    res.status(201).json({ message: 'Message sent successfully', id: savedMessage._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { validateContact, submitContact };
