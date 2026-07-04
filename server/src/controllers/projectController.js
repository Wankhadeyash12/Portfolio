const Project = require('../models/Project');
const { buildFileMeta, deleteStoredFile } = require('../utils/fileStorage');

const parseProjectBody = (body) => {
  const data = { ...body };
  if (typeof data.techStack === 'string') {
    data.techStack = data.techStack.split(',').map((t) => t.trim()).filter(Boolean);
  }
  if (data.featured !== undefined) {
    data.featured = data.featured === 'true' || data.featured === true;
  }
  if (data.order !== undefined) {
    data.order = parseInt(data.order, 10) || 0;
  }
  return data;
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const data = parseProjectBody(req.body);
    if (req.file) {
      data.image = buildFileMeta(req.file, 'images');
    }
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const data = parseProjectBody(req.body);
    if (req.file) {
      if (project.image?.publicId) {
        await deleteStoredFile(project.image.publicId);
      }
      data.image = buildFileMeta(req.file, 'images');
    }

    Object.assign(project, data);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.image?.publicId) {
      await deleteStoredFile(project.image.publicId);
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getFeaturedProjects,
  createProject,
  updateProject,
  deleteProject,
};
