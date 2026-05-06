const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Materials Science', 'Quantum Computing', 'Drug Delivery', 'Electronics', 'Energy', 'Other'],
    default: 'Other'
  },
  image: {
    type: String,
    default: ''
  },
  technologies: [String],
  link: {
    type: String,
    default: ''
  },
  githubLink: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
