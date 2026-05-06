import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FiDatabase, FiSmartphone, FiGitBranch, 
  FiBarChart2
} from 'react-icons/fi';
import { containerVariants, itemVariants } from '../utils/animations';

const Skills = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const skillCategories = [
    {
      category: 'Frontend Development',
      icon: FiSmartphone,
      skills: [
        { name: 'React', level: 90 },
        { name: 'Tailwind CSS', level: 85 },
        { name: 'JavaScript', level: 88 },
        { name: 'HTML/CSS', level: 95 },
      ],
    },
    {
      category: 'Backend Development',
      icon: FiDatabase,
      skills: [
        { name: 'Node.js', level: 85 },
        { name: 'Express', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'APIs/REST', level: 88 },
      ],
    },
    {
      category: 'Data & AI',
      icon: FiBarChart2,
      skills: [
        { name: 'Machine Learning', level: 75 },
        { name: 'Python (Data)', level: 82 },
        { name: 'TensorFlow', level: 70 },
        { name: 'Data Analysis', level: 80 },
      ],
    },
    {
      category: 'Tools & Others',
      icon: FiGitBranch,
      skills: [
        { name: 'Git/GitHub', level: 90 },
        { name: 'MongoDB', level: 80 },
        { name: 'SQL', level: 85 },
        { name: 'Docker', level: 70 },
      ],
    },
  ];

  return (
    <section id="skills" ref={ref} className="section bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Skills &amp; <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Technologies and tools I work with
            </p>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            {skillCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="card bg-white dark:bg-dark-700"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <Icon className="w-6 h-6 text-cyan-500" />
                    </div>
                    <h3 className="text-xl font-bold">{category.category}</h3>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-5">
                    {category.skills.map((skill, sidx) => (
                      <div key={sidx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: sidx * 0.1 }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Additional Skills Tags */}
          <motion.div variants={itemVariants} className="mt-12">
            <h3 className="text-lg font-semibold mb-6 text-center">Other Skills</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Problem Solving',
                'Clean Code',
                'Debugging',
                'UI/UX Design',
                'Responsive Design',
                'Performance Optimization',
                'Testing',
                'Agile Methodologies',
                'Linux',
                'AWS',
              ].map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="px-4 py-2 rounded-full glass-effect text-sm font-medium"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
