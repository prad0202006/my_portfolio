import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    backgroundImage: '',
    socialLinks: { linkedin: '', twitter: '', github: '' }
  });
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Other',
    image: '',
    technologies: '',
    link: '',
    githubLink: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social')) {
      const socialField = name.split('.')[1];
      setProfile({
        ...profile,
        socialLinks: { ...profile.socialLinks, [socialField]: value }
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API_URL}/profile`, profile, { headers });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      setMessage('Title and description are required');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingProjectId) {
        await axios.put(`${API_URL}/projects/${editingProjectId}`, projectData, { headers });
        setMessage('Project updated successfully!');
        setEditingProjectId(null);
      } else {
        await axios.post(`${API_URL}/projects`, projectData, { headers });
        setMessage('Project added successfully!');
      }

      setNewProject({
        title: '',
        description: '',
        category: 'Other',
        image: '',
        technologies: '',
        link: '',
        githubLink: ''
      });
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving project');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setNewProject({
      ...project,
      technologies: project.technologies.join(', ')
    });
    setEditingProjectId(project._id);
    setActiveTab('projects');
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, { headers });
      setMessage('Project deleted successfully!');
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting project');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setNewProject({
      title: '',
      description: '',
      category: 'Other',
      image: '',
      technologies: '',
      link: '',
      githubLink: ''
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Edit Profile</h2>
            <div className="form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={profile.title}
                  onChange={handleProfileChange}
                  placeholder="Your Title"
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Your Bio"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Your Email"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Your Phone"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  placeholder="Your Location"
                />
              </div>
              <div className="form-group">
                <label>Profile Image URL</label>
                <input
                  type="text"
                  name="profileImage"
                  value={profile.profileImage}
                  onChange={handleProfileChange}
                  placeholder="Image URL"
                />
              </div>
              <div className="form-group">
                <label>Background Image URL</label>
                <input
                  type="text"
                  name="backgroundImage"
                  value={profile.backgroundImage}
                  onChange={handleProfileChange}
                  placeholder="Image URL"
                />
              </div>
              <h3>Social Links</h3>
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="social.linkedin"
                  value={profile.socialLinks.linkedin}
                  onChange={handleProfileChange}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="text"
                  name="social.twitter"
                  value={profile.socialLinks.twitter}
                  onChange={handleProfileChange}
                  placeholder="Twitter URL"
                />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="text"
                  name="social.github"
                  value={profile.socialLinks.github}
                  onChange={handleProfileChange}
                  placeholder="GitHub URL"
                />
              </div>
              <button onClick={handleSaveProfile} disabled={loading} className="save-btn">
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            <h2>{editingProjectId ? 'Edit Project' : 'Add New Project'}</h2>
            <div className="form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProject.title}
                  onChange={handleProjectChange}
                  placeholder="Project Title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleProjectChange}
                  placeholder="Project Description"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={newProject.category} onChange={handleProjectChange}>
                  <option value="Materials Science">Materials Science</option>
                  <option value="Quantum Computing">Quantum Computing</option>
                  <option value="Drug Delivery">Drug Delivery</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Energy">Energy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newProject.image}
                  onChange={handleProjectChange}
                  placeholder="Image URL"
                />
              </div>
              <div className="form-group">
                <label>Technologies (comma-separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={newProject.technologies}
                  onChange={handleProjectChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="form-group">
                <label>Project Link</label>
                <input
                  type="text"
                  name="link"
                  value={newProject.link}
                  onChange={handleProjectChange}
                  placeholder="Project URL"
                />
              </div>
              <div className="form-group">
                <label>GitHub Link</label>
                <input
                  type="text"
                  name="githubLink"
                  value={newProject.githubLink}
                  onChange={handleProjectChange}
                  placeholder="GitHub URL"
                />
              </div>
              <div className="button-group">
                <button onClick={handleAddProject} disabled={loading} className="save-btn">
                  {loading ? 'Saving...' : editingProjectId ? 'Update Project' : 'Add Project'}
                </button>
                {editingProjectId && (
                  <button onClick={handleCancelEdit} className="cancel-btn">
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <h2 style={{ marginTop: '40px' }}>Your Projects</h2>
            <div className="projects-list">
              {projects.length > 0 ? (
                projects.map(project => (
                  <div key={project._id} className="project-item">
                    <div className="project-info">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <p className="category-badge">{project.category}</p>
                    </div>
                    <div className="project-actions">
                      <button onClick={() => handleEditProject(project)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProject(project._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects yet. Add your first project!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
