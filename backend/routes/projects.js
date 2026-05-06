const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../db.json');

// Helper functions
async function readDB() {
  const data = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    const projects = db.projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const db = await readDB();
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = await readDB();
    const project = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.projects.push(project);
    await writeDB(db);
    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await readDB();
    const projectIndex = db.projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const project = { ...db.projects[projectIndex], ...req.body, updatedAt: new Date().toISOString() };
    db.projects[projectIndex] = project;
    await writeDB(db);
    res.json({ message: 'Project updated', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await readDB();
    const projectIndex = db.projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    db.projects.splice(projectIndex, 1);
    await writeDB(db);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
