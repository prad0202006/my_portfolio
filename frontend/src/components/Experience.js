import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiAward, FiBookOpen } from 'react-icons/fi';
import { containerVariants, itemVariants } from '../utils/animations';

const Experience = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const experiences = [
    {
      type: 'education',
      icon: FiBookOpen,
      title: 'Bachelor of Computer Applications (BCA)',
      organization: 'University Name',
      period: '2022 - 2025',
      description: 'Specialization in AI/ML with focus on web development and data science.',
      highlights: ['CGPA: 8.5/10', 'AI/ML Specialization', 'Web Development Focus'],
    },
    {
      type: 'experience',
      icon: FiBriefcase,
      title: 'Full Stack Developer Intern',
      organization: 'Tech Startup XYZ',
      period: 'Jun 2024 - Present',
      description: 'Building scalable web applications using React, Node.js, and MongoDB. Contributed to multiple projects with focus on performance optimization.',
      highlights: ['Developed 3+ projects', 'Improved performance by 40%', 'Led junior developers'],
    },
    {
      type: 'experience',
      icon: FiBriefcase,
      title: 'Frontend Developer Intern',
      organization: 'Digital Solutions Co.',
      period: 'Jan 2024 - May 2024',
      description: 'Created responsive and interactive user interfaces using React and Tailwind CSS. Collaborated with design team for UI/UX improvements.',
      highlights: ['5+ responsive designs', 'Accessibility improvements', 'Team collaboration'],
    },
    {
      type: 'achievement',
      icon: FiAward,
      title: 'Open Source Contributor',
      organization: 'Multiple Projects',
      period: '2023 - Present',
      description: 'Active contributor to various open-source projects including web frameworks and data science libraries.',
      highlights: ['50+ commits', '3 merged PRs', 'Community member'],
    },
  ];

  return (
    <section id="experience" ref={ref} className="section bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Experience &amp; <span className="gradient-text">Education</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              My professional journey and achievements
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            {experiences.map((exp, idx) => {
              const Icon = exp.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Timeline marker */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 top-8">
                      <div className="w-4 h-4 bg-cyan-500 rounded-full border-4 border-white dark:border-dark-800" />
                    </div>

                    {/* Content */}
                    <div
                      className={`card bg-white dark:bg-dark-700 ${
                        isEven ? 'md:col-start-1' : 'md:col-start-2'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${
                          exp.type === 'education'
                            ? 'bg-blue-500/20'
                            : exp.type === 'experience'
                            ? 'bg-green-500/20'
                            : 'bg-purple-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            exp.type === 'education'
                              ? 'text-blue-500'
                              : exp.type === 'experience'
                              ? 'text-green-500'
                              : 'text-purple-500'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{exp.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exp.organization}
                          </p>
                        </div>
                      </div>

                      {/* Period */}
                      <p className="text-sm font-semibold text-cyan-500 mb-3">
                        {exp.period}
                      </p>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {exp.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {exp.highlights.map((highlight, hidx) => (
                          <span
                            key={hidx}
                            className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '2+', label: 'Years Experience' },
              { value: '10+', label: 'Projects Completed' },
              { value: '50+', label: 'Open Source Commits' },
              { value: '100%', label: 'Dedication' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="p-6 text-center card bg-white dark:bg-dark-700"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
