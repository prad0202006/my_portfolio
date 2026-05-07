const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Mock data - replace with database
let projectsData = [
  {
    id: 1,
    title: 'AI Portfolio Website',
    description: 'A production-grade portfolio with AI-powered resume parsing and real-time updates.',
    technologies: ['React', 'Node.js', 'Socket.IO', 'AI/ML'],
    githubUrl: 'https://github.com/prad0202006/my_portfolio',
    liveUrl: 'https://pradeepg.dev',
    imageUrl: '',
    featured: true,
    createdAt: new Date().toISOString()
  }
];

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', (req, res) => {
  const { featured, limit } = req.query;

  let filteredProjects = projectsData;

  if (featured === 'true') {
    filteredProjects = projectsData.filter(project => project.featured);
  }

  if (limit) {
    filteredProjects = filteredProjects.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    data: filteredProjects,
    count: filteredProjects.length
  });
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const project = projectsData.find(p => p.id === parseInt(req.params.id));

  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  res.json({
    success: true,
    data: project
  });
});

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', authenticate, validate(schemas.project), (req, res) => {
  const newProject = {
    id: projectsData.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };

  projectsData.push(newProject);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: newProject
  });
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', authenticate, validate(schemas.project), (req, res) => {
  const projectIndex = projectsData.findIndex(p => p.id === parseInt(req.params.id));

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  projectsData[projectIndex] = {
    ...projectsData[projectIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: projectsData[projectIndex]
  });
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', authenticate, (req, res) => {
  const projectIndex = projectsData.findIndex(p => p.id === parseInt(req.params.id));

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  const deletedProject = projectsData.splice(projectIndex, 1)[0];

  res.json({
    success: true,
    message: 'Project deleted successfully',
    data: deletedProject
  });
});

module.exports = router;