const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
    res.json({ skills, grouped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSkill = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.level !== undefined) data.level = parseInt(data.level, 10);
    if (data.order !== undefined) data.order = parseInt(data.order, 10) || 0;
    const skill = await Skill.create(data);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.level !== undefined) data.level = parseInt(data.level, 10);
    if (data.order !== undefined) data.order = parseInt(data.order, 10) || 0;
    const skill = await Skill.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
