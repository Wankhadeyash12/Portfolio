const Experience = require('../models/Experience');

const parseExperienceBody = (body) => {
  const data = { ...body };
  if (data.current !== undefined) {
    data.current = data.current === 'true' || data.current === true;
  }
  if (data.current) {
    data.endDate = null;
  }
  if (data.order !== undefined) {
    data.order = parseInt(data.order, 10) || 0;
  }
  return data;
};

const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ order: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const data = parseExperienceBody(req.body);
    const entry = await Experience.create(data);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const data = parseExperienceBody(req.body);
    const entry = await Experience.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const entry = await Experience.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
