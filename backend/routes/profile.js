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

// Get profile (public)
router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    let profile = db.profiles[0];
    if (!profile) {
      profile = {
        name: 'Your Name',
        title: 'Nanotech Portfolio',
        bio: 'Welcome to my nanotech portfolio',
        email: 'contact@example.com',
        phone: '+1 (555) 000-0000',
        location: 'Your Location',
        profileImage: '',
        backgroundImage: '',
        socialLinks: { linkedin: '', twitter: '', github: '' },
        updatedAt: new Date().toISOString()
      };
      db.profiles.push(profile);
      await writeDB(db);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile (admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const db = await readDB();
    let profile = db.profiles[0];
    if (!profile) {
      profile = { ...req.body };
    } else {
      Object.assign(profile, req.body);
    }
    profile.updatedAt = new Date().toISOString();
    db.profiles[0] = profile;
    await writeDB(db);
    res.json({ message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
