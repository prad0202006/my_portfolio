import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { containerVariants, itemVariants } from '../utils/animations';

const Contact = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }

    setStatus('loading');

    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setError('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'gp893727@gmail.com',
      href: 'mailto:gp893727@gmail.com',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+91 9876543210',
      href: 'tel:+919876543210',
    },
    {
      icon: FiMapPin,
      title: 'Location',
      value: 'India',
      href: '#',
    },
  ];

  return (
    <section id="contact" ref={ref} className="section max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Have a project in mind? Let's talk about it
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Pradeep G"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 focus:border-cyan-500"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 focus:border-cyan-500"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 focus:border-cyan-500"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 focus:border-cyan-500 resize-none"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/30"
                >
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Success Message */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 text-green-500 border border-green-500/30"
                >
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Message sent successfully!</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'loading' ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={containerVariants} className="space-y-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={idx}
                  href={info.href}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-6 card bg-white dark:bg-dark-700 group"
                  whileHover={{ x: 10 }}
                >
                  <div className="p-3 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              );
            })}

            {/* Download Resume */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
            >
              <h3 className="font-semibold mb-3">Download My Resume</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get a detailed overview of my skills, experience, and projects.
              </p>
              <motion.a
                href="/resume.pdf"
                download
                className="inline-block btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="pt-4">
              <h3 className="font-semibold mb-4">Connect With Me</h3>
              <div className="flex gap-4">
                {[
                  { label: 'GitHub', url: 'https://github.com/prad0202006' },
                  { label: 'LinkedIn', url: 'https://linkedin.com' },
                  { label: 'Twitter', url: 'https://twitter.com' },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg glass-effect text-sm hover:text-cyan-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
