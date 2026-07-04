const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: String,
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    repliedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
