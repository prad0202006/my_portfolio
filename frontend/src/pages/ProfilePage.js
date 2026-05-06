import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileRes = await axios.get(`${API_URL}/profile`);
      const projectsRes = await axios.get(`${API_URL}/projects`);
      
      setProfile(profileRes.data);
      setProjects(projectsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading profile...</p></div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <div className="hero-section">
        {profile?.backgroundImage && (
          <img src={profile.backgroundImage} alt="Background" className="background-image" />
        )}
        <div className="hero-content">
          {profile?.profileImage && (
            <img src={profile.profileImage} alt={profile.name} className="profile-image" />
          )}
          <h1>{profile?.name || 'Your Name'}</h1>
          <p className="title">{profile?.title || 'Nanotech Portfolio'}</p>
          <p className="bio">{profile?.bio || 'Welcome to my nanotech portfolio'}</p>
          <div className="contact-info">
            <span>📧 {profile?.email || 'contact@example.com'}</span>
            <span>📱 {profile?.phone || '+1 (555) 000-0000'}</span>
            <span>📍 {profile?.location || 'Your Location'}</span>
          </div>
          <div className="social-links">
            {profile?.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {profile?.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
            {profile?.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="container">
        <section className="projects-section">
          <h2>Projects</h2>
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project._id} className="project-card card">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="project-image" />
                  )}
                  <h3>{project.title}</h3>
                  <p className="category">{project.category}</p>
                  <p className="description">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="technologies">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-links">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No projects added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
