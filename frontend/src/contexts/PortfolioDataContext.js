import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioDataContext = createContext();

export const PortfolioDataProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState({
    name: 'Pradeep G',
    title: 'BCA Student | Entry-Level Software Developer',
    email: 'gp893727@gmail.com',
    phone: '+91 70190 37528',
    location: 'HSR Layout, Bengaluru, Karnataka 560102, India',
    summary: 'Motivated BCA student with hands-on exposure to customer-facing operations, inventory coordination, and order-flow management through work experience at Zepto.',
    skills: {
      programming: 'Python, Java basics, C, C++, JavaScript, Express.js, CSS',
      database: 'SQL, PL/SQL',
      web: 'HTML basics',
      tools: 'Tally.ERP 9, basic computer operations, digital literacy',
      professional: 'Communication, teamwork, time management, problem solving, quick learning',
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
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Govt. First Grade College, HSR Layout, Bengaluru, India',
        duration: 'Jan 2023 - Present',
        status: 'Ongoing'
      }
    ],
    projects: [
      {
        title: 'Premium Portfolio Website',
        description: 'Modern, high-end portfolio website showcasing skills and projects as a Full-Stack Developer',
        tech: 'React 18, Tailwind CSS, Framer Motion, SEO, PWA',
        link: 'https://prad0202006.github.io/my_portfolio',
        github: 'https://github.com/prad0202006/my_portfolio'
      },
      {
        title: 'Library Management System',
        description: 'Developed a project focused on organizing library records and simplifying book-management workflows',
        tech: 'Python, Database, CRUD Operations',
        github: 'https://github.com/prad0202006/library-management-system'
      }
    ],
    links: {
      github: 'github.com/prad0202006',
      linkedin: 'linkedin.com/in/pradeep-g-70836731a',
      portfolio: 'prad0202006.github.io/my_portfolio'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        setPortfolioData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to load saved portfolio data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
  }, [portfolioData]);

  const updatePortfolioData = (newData) => {
    setPortfolioData(prev => ({
      ...prev,
      ...newData
    }));
    setError(null);
  };

  const updateSkills = (newSkills) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        ...newSkills
      }
    }));
  };

  const updateExperience = (newExperience) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: Array.isArray(newExperience) ? newExperience : [newExperience]
    }));
  };

  const updateEducation = (newEducation) => {
    setPortfolioData(prev => ({
      ...prev,
      education: Array.isArray(newEducation) ? newEducation : [newEducation]
    }));
  };

  const updateProjects = (newProjects) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: Array.isArray(newProjects) ? newProjects : [newProjects]
    }));
  };

  const resetToDefault = () => {
    localStorage.removeItem('portfolioData');
    window.location.reload();
  };

  const value = {
    portfolioData,
    isLoading,
    error,
    updatePortfolioData,
    updateSkills,
    updateExperience,
    updateEducation,
    updateProjects,
    resetToDefault,
    setError,
    setIsLoading
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within PortfolioDataProvider');
  }
  return context;
};
