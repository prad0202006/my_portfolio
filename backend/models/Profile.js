const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Your Name'
  },
  title: {
    type: String,
    default: 'Nanotech Portfolio'
  },
  bio: {
    type: String,
    default: 'Welcome to my nanotech portfolio'
  },
  email: {
    type: String,
    default: 'contact@example.com'
  },
  phone: {
    type: String,
    default: '+1 (555) 000-0000'
  },
  location: {
    type: String,
    default: 'Your Location'
  },
  profileImage: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', profileSchema);
