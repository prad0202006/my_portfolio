const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Mock data - replace with database
let profileData = {
  name: 'Pradeep G',
  title: 'Full-Stack Developer & AI/ML Enthusiast',
  bio: 'Passionate developer creating innovative solutions with modern technologies.',
  email: 'gp893727@gmail.com',
  phone: '+91 9876543210',
  location: 'Your Location',
  profileImage: '',
  backgroundImage: '',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/pradeepg',
    github: 'https://github.com/prad0202006',
    twitter: '',
    website: ''
  },
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AI/ML'],
  experience: [],
  education: [],
  updatedAt: new Date().toISOString()
};

/**
 * @route   GET /api/profile
 * @desc    Get portfolio profile
 * @access  Public
 */
router.get('/', optionalAuth, (req, res) => {
  res.json({
    success: true,
    data: profileData
  });
});

/**
 * @route   PUT /api/profile
 * @desc    Update portfolio profile
 * @access  Private
 */
router.put('/', authenticate, validate(schemas.profileUpdate), (req, res) => {
  const updates = req.body;

  // Update profile data
  profileData = {
    ...profileData,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: profileData
  });
});

/**
 * @route   GET /api/profile/stats
 * @desc    Get profile statistics
 * @access  Public
 */
router.get('/stats', (req, res) => {
  const stats = {
    skillsCount: profileData.skills?.length || 0,
    experienceCount: profileData.experience?.length || 0,
    educationCount: profileData.education?.length || 0,
    projectsCount: 0, // Will be populated from projects route
    lastUpdated: profileData.updatedAt
  };

  res.json({
    success: true,
    data: stats
  });
});

module.exports = router;