const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Resume', 'Offer Letter', 'Certificate', 'Other'],
    },
    fileUrl: { type: String, required: true },
    publicId: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
