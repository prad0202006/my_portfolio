import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { containerVariants, itemVariants } from '../utils/animations';

const Hero = () => {
  const roles = ['Full-Stack Developer', 'AI/ML Enthusiast', 'Problem Solver'];
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [roles.length]);

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/prad0202006', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://linkedin.com/in/pradeepg', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:gp893727@gmail.com', label: 'Email' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto"
      >
        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="text-cyan-500 font-semibold text-lg mb-4 flex items-center justify-center gap-2"
        >
          <span className="w-8 h-px bg-cyan-500" />
          Welcome to my portfolio
          <span className="w-8 h-px bg-cyan-500" />
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
        >
          Hi, I'm{' '}
          <span className="gradient-text">Pradeep G</span>
        </motion.h1>

        {/* Animated Role */}
        <motion.div
          variants={itemVariants}
          className="text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mb-8 h-12 flex items-center justify-center"
        >
          I'm a{' '}
          <motion.span
            key={currentRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-cyan-500 font-semibold ml-2"
          >
            {roles[currentRole]}
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          BCA Student | AI/ML Enthusiast | Building modern web applications with cutting-edge technologies.
          Passionate about creating beautiful, functional, and scalable solutions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.a
            href="#projects"
            className="btn-primary inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            className="btn-secondary inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-6 mb-12"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg glass-effect text-gray-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/50"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <a href="#about" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">
            <FiArrowDown className="w-6 h-6" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
