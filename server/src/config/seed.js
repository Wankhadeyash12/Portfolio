require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yash-portfolio', {
      dbName: process.env.MONGO_DB_NAME || 'yash-portfolio',
      serverSelectionTimeoutMS: 10000,
    });

    await Profile.findOneAndUpdate(
      {},
      {
        name: 'Yash Wankhade',
        tagline: 'Full Stack Web & Android Developer',
        bio: 'Enthusiastic developer with expertise in MERN Stack and Android development. Passionate about building scalable web applications and user-friendly interfaces.',
        email: 'wankhadeyash2006@gmail.com',
        phone: '+91 9322754341',
        location: 'Nagpur, Maharashtra, India',
        github: '',
        linkedin: '',
        instagram: '',
        theme: { primary: '#0F6E56', accent: '#1D9E75' },
      },
      { upsert: true, new: true }
    );

    const experiences = [
      {
        company: 'Xtroverse IT Solutions Pvt. Ltd.',
        role: 'Full Stack Developer Intern',
        type: 'Internship',
        startDate: new Date('2026-06-01'),
        endDate: null,
        current: true,
        location: 'Nagpur',
        description: 'Working on full stack web development projects using MERN stack.',
        order: 3,
      },
      {
        company: 'Visanet Software Pvt. Ltd.',
        role: 'Front End Developer Intern',
        type: 'Internship',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-12-31'),
        current: false,
        location: 'Washim',
        description: 'Developed responsive web interfaces and improved user experience.',
        order: 2,
      },
      {
        company: 'Visanet Software Pvt. Ltd.',
        role: 'App Developer Intern',
        type: 'Internship',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2025-12-31'),
        current: false,
        location: 'Washim',
        description: 'Built Android applications with Java and Firebase integration.',
        order: 1,
      },
    ];

    for (const exp of experiences) {
      await Experience.findOneAndUpdate(
        { company: exp.company, role: exp.role },
        exp,
        { upsert: true, new: true }
      );
    }

    const skills = [
      { name: 'React.js', category: 'Frontend', level: 90, order: 1 },
      { name: 'HTML5', category: 'Frontend', level: 95, order: 2 },
      { name: 'CSS3', category: 'Frontend', level: 90, order: 3 },
      { name: 'JavaScript', category: 'Frontend', level: 88, order: 4 },
      { name: 'Node.js', category: 'Backend', level: 82, order: 1 },
      { name: 'Express.js', category: 'Backend', level: 80, order: 2 },
      { name: 'MongoDB', category: 'Backend', level: 78, order: 3 },
      { name: 'REST API', category: 'Backend', level: 85, order: 4 },
      { name: 'Android Studio', category: 'Android', level: 75, order: 1 },
      { name: 'Java', category: 'Android', level: 72, order: 2 },
      { name: 'Firebase', category: 'Android', level: 70, order: 3 },
      { name: 'XML', category: 'Android', level: 75, order: 4 },
      { name: 'Git', category: 'Tools', level: 88, order: 1 },
      { name: 'GitHub', category: 'Tools', level: 88, order: 2 },
      { name: 'AWS', category: 'Tools', level: 60, order: 3 },
      { name: 'Postman', category: 'Tools', level: 80, order: 4 },
    ];

    for (const skill of skills) {
      await Skill.findOneAndUpdate({ name: skill.name }, skill, { upsert: true, new: true });
    }

    await Project.findOneAndUpdate(
      { title: 'Women Safety App' },
      {
        title: 'Women Safety App',
        description:
          'Emergency alert mobile application with SOS alerts, live location sharing, and user-friendly UI. Presented at MSBTE State-Level Event.',
        techStack: ['Android Studio', 'Java', 'Firebase'],
        featured: true,
        order: 1,
      },
      { upsert: true, new: true }
    );

    console.log('Seed complete');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
