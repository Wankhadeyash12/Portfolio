const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: String,
    bio: String,
    photo: {
      url: String,
      publicId: String,
    },
    email: String,
    phone: String,
    location: String,
    github: String,
    linkedin: String,
    instagram: String,
    website: String,
    resumeUrl: String,
    resumePublicId: String,
    resumeName: String,
    theme: {
      primary: { type: String, default: '#0F6E56' },
      accent: { type: String, default: '#1D9E75' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
