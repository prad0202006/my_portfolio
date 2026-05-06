import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { containerVariants, itemVariants } from '../utils/animations';

const Projects = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Nanotech Portfolio Website',
      description: 'A modern, responsive portfolio website built with React, Tailwind CSS, and Framer Motion. Features dark mode, smooth animations, and an admin panel.',
      image: '🌐',
      tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
      category: 'fullstack',
      github: 'https://github.com/prad0202006/my_portfolio',
      live: '#',
    },
    {
      id: 2,
      title: 'AI Image Generator',
      description: 'A machine learning project that generates images using neural networks. Built with Python, TensorFlow, and deployed with Flask API.',
      image: '🤖',
      tags: ['Python', 'TensorFlow', 'Flask', 'ML'],
      category: 'ml',
      github: 'https://github.com',
      live: '#',
    },
    {
      id: 3,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application with user authentication, product management, and payment integration.',
      image: '🛒',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'fullstack',
      github: 'https://github.com',
      live: '#',
    },
    {
      id: 4,
      title: 'Task Management App',
      description: 'A collaborative task management tool with real-time updates, user authentication, and task tracking features.',
      image: '✓',
      tags: ['React', 'Firebase', 'Tailwind CSS'],
      category: 'frontend',
      github: 'https://github.com',
      live: '#',
    },
    {
      id: 5,
      title: 'Chat Application',
      description: 'Real-time messaging application with WebSocket integration, user profiles, and conversation history.',
      image: '💬',
      tags: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
      category: 'fullstack',
      github: 'https://github.com',
      live: '#',
    },
    {
      id: 6,
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for visualizing complex datasets with charts, graphs, and real-time data updates.',
      image: '📊',
      tags: ['React', 'D3.js', 'Python', 'API'],
      category: 'frontend',
      github: 'https://github.com',
      live: '#',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'ml', label: 'AI/ML' },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((project) => project.category === filter);

  return (
    <section id="projects" ref={ref} className="section max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            A selection of my recent work and side projects
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === cat.value
                  ? 'btn-primary'
                  : 'glass-effect text-gray-700 dark:text-gray-300 hover:text-cyan-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              className="card bg-white dark:bg-dark-700 overflow-hidden group"
            >
              {/* Project Image/Icon */}
              <div className="h-48 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                {project.image}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-500"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="text-xs px-2 py-1 text-gray-500">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass-effect hover:text-cyan-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiGithub className="w-4 h-4" />
                    Code
                  </motion.a>
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg btn-primary text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Live
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Projects */}
        <motion.div variants={itemVariants} className="text-center">
          <a
            href="https://github.com/prad0202006"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-secondary"
          >
            View All Projects on GitHub
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Projects;
