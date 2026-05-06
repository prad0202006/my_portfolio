import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiExternalLink } from 'react-icons/fi';

const Resume = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const resumeData = {
    contact: {
      phone: '+91 70190 37528',
      email: 'gp893727@gmail.com',
      location: 'HSR Layout, Bengaluru, Karnataka 560102, India',
      linkedin: 'linkedin.com/in/pradeep-g-70836731a',
      github: 'github.com/prad0202006',
      portfolio: 'prad0202006.github.io/my_portfolio'
    },
    summary: `Motivated BCA student with hands-on exposure to customer-facing operations, inventory coordination, and order-flow management through work experience at Zepto. Building a foundation in programming, databases, web fundamentals, and accounting software, with practical project experience in a Library Management System. Known for being a quick learner, reliable team contributor, and clear communicator who can adapt quickly in fast-paced professional environments.`,
    skills: {
      programming: 'Python, Java basics, C, C++, JavaScript, Express.js, CSS',
      database: 'SQL, PL/SQL',
      web: 'HTML, CSS, React, Responsive Design',
      tools: 'Tally.ERP 9, Git, VS Code, basic computer operations',
      professional: 'Communication, Teamwork, Time Management, Problem Solving, Quick Learning',
      languages: 'English, Hindi, Kannada, Tamil'
    },
    experience: [
      {
        title: 'Flex Associate',
        company: 'Zepto, Bengaluru, India',
        duration: 'Jan 2025 - Jun 2025',
        points: [
          'Managed daily order-flow activities while supporting timely and accurate fulfillment',
          'Handled products carefully and followed operational processes to maintain service quality',
          'Supported inventory-related tasks, helping keep stock movement organized and traceable',
          'Coordinated with team members in a fast-paced environment to improve customer satisfaction',
          'Built practical workplace skills in accountability, task prioritization, and communication'
        ]
      }
    ],
    projects: [
      {
        title: 'Premium Portfolio Website',
        description: 'Modern, high-end portfolio website built with React, Tailwind CSS, and Framer Motion',
        tech: 'React 18, Tailwind CSS, Framer Motion, SEO, PWA',
        link: 'https://prad0202006.github.io/my_portfolio',
        github: 'https://github.com/prad0202006/my_portfolio'
      },
      {
        title: 'Library Management System',
        description: 'Project focused on organizing library records and simplifying book-management workflows',
        tech: 'Python, Database, CRUD Operations',
        github: 'https://github.com/prad0202006/library-management-system'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Govt. First Grade College, HSR Layout, Bengaluru, India',
        duration: 'Jan 2023 - Present',
        status: 'Ongoing'
      }
    ]
  };

  return (
    <section id="resume" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-dark-900 dark:to-dark-800">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Resume
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 text-lg">
            Download my full resume or view the details below
          </motion.p>

          {/* Download Button */}
          <motion.a
            variants={itemVariants}
            href="https://github.com/prad0202006"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload className="w-5 h-5" />
            Download Full Resume
          </motion.a>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Contact Information
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <p><span className="font-semibold">Phone:</span> {resumeData.contact.phone}</p>
            <p><span className="font-semibold">Email:</span> {resumeData.contact.email}</p>
            <p><span className="font-semibold">Location:</span> {resumeData.contact.location}</p>
            <div>
              <span className="font-semibold">Links:</span>
              <div className="flex gap-2 mt-1 flex-wrap">
                <a href={`https://${resumeData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                  LinkedIn <FiExternalLink className="w-3 h-3" />
                </a>
                <a href={`https://${resumeData.contact.github}`} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1">
                  GitHub <FiExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Professional Summary */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Professional Summary
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {resumeData.summary}
          </motion.p>
        </motion.div>

        {/* Skills */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Skills
          </motion.h2>
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <motion.div key={category} variants={itemVariants}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{skills}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Experience */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Experience
          </motion.h2>
          <motion.div variants={containerVariants} className="space-y-6">
            {resumeData.experience.map((job, idx) => (
              <motion.div key={idx} variants={itemVariants} className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-cyan-500 font-semibold">{job.company}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{job.duration}</p>
                <ul className="space-y-2">
                  {job.points.map((point, pidx) => (
                    <li key={pidx} className="text-gray-700 dark:text-gray-300 flex gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Projects
          </motion.h2>
          <motion.div variants={containerVariants} className="space-y-6">
            {resumeData.projects.map((project, idx) => (
              <motion.div key={idx} variants={itemVariants} className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-semibold">Tech:</span> {project.tech}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1 text-sm">
                      Live Demo <FiExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1 text-sm">
                      View on GitHub <FiExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Education */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl bg-white dark:bg-dark-800/50 border border-gray-200 dark:border-gray-700"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Education
          </motion.h2>
          <motion.div variants={containerVariants} className="space-y-4">
            {resumeData.education.map((edu, idx) => (
              <motion.div key={idx} variants={itemVariants} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                <p className="text-blue-500 font-semibold">{edu.institution}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.duration} - {edu.status}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
