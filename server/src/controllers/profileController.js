const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');
const { buildFileMeta, deleteStoredFile, uploadsRoot, serverUrl } = require('../utils/fileStorage');

const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ name: 'Yash Wankhade' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ name: req.body.name || 'Yash Wankhade' });
    }

    const fields = [
      'name', 'tagline', 'bio', 'email', 'phone', 'location',
      'github', 'linkedin', 'instagram', 'website',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    if (req.body.themePrimary !== undefined || req.body.themeAccent !== undefined) {
      profile.theme = {
        primary: req.body.themePrimary || profile.theme?.primary || '#0F6E56',
        accent: req.body.themeAccent || profile.theme?.accent || '#1D9E75',
      };
    }

    const photoFile = req.files?.photo?.[0];
    const resumeFile = req.files?.resume?.[0];

    if (photoFile) {
      if (profile.photo?.publicId) {
        await deleteStoredFile(profile.photo.publicId);
      }
      profile.photo = buildFileMeta(photoFile, 'avatars');
    }

    if (resumeFile) {
      if (profile.resumePublicId) {
        await deleteStoredFile(profile.resumePublicId);
      }
      const meta = buildFileMeta(resumeFile, 'documents');
      profile.resumePublicId = meta.publicId;
      profile.resumeName = resumeFile.originalname;
      profile.resumeUrl = `${serverUrl()}/api/profile/resume`;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile?.resumePublicId) {
      return res.status(404).json({
        message: 'No resume uploaded yet. Go to Admin -> Profile and upload a resume PDF.',
      });
    }

    const filePath = path.join(uploadsRoot, profile.resumePublicId);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found on disk.' });
    }

    const downloadName = profile.resumeName || `${(profile.name || 'Resume').replace(/\s+/g, '-')}-Resume.pdf`;
    return res.download(filePath, downloadName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getResume };
