import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { containerVariants, itemVariants } from '../utils/animations';

const About = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="about" ref={ref} className="section max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Get to know more about my background and expertise
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image/Illustration */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl opacity-20 blur-2xl animate-pulse-slow" />
              <div className="absolute inset-0 rounded-2xl glass-effect flex items-center justify-center">
                <div className="text-6xl">💻</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Text Content */}
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.p
              variants={itemVariants}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
            >
              I'm a passionate <span className="font-semibold text-cyan-500">BCA student</span> with a deep interest in 
              <span className="font-semibold"> AI/ML and Web Development</span>. I love solving complex problems and 
              creating beautiful digital experiences.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
            >
              My journey in tech started with curiosity about how things work. Now, I specialize in building 
              full-stack applications with modern technologies like React, Node.js, and Python.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
            >
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
              or sharing my knowledge with the community. I believe in continuous learning and growth.
            </motion.p>

            {/* Key Points */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {[
                { label: 'Projects', value: '15+' },
                { label: 'Happy Clients', value: '10+' },
                { label: 'Technologies', value: '20+' },
                { label: 'Years Experience', value: '2+' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-4 rounded-lg glass-effect text-center"
                >
                  <div className="text-2xl font-bold gradient-text">{item.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="pt-4">
              <a
                href="#contact"
                className="inline-block btn-primary"
              >
                Let's Work Together
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
