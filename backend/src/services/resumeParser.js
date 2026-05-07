const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const logger = require('./logger');

/**
 * Resume Parsing Service
 * Handles PDF and DOCX parsing with enhanced AI-like extraction
 */
class ResumeParserService {
  constructor() {
    this.parsingProgress = {
      EXTRACTING_TEXT: 10,
      PARSING_NAME: 20,
      PARSING_CONTACT: 30,
      PARSING_SKILLS: 40,
      PARSING_EXPERIENCE: 60,
      PARSING_EDUCATION: 75,
      PARSING_PROJECTS: 85,
      FINALIZING: 95,
      COMPLETE: 100
    };
  }

  /**
   * Main parsing method
   */
  async parseResume(filePath, fileType, socket = null, clientId = null) {
    try {
      logger.info(`Starting resume parsing for file: ${filePath}, type: ${fileType}`);

      // Update progress: Extracting text
      this.updateProgress(socket, clientId, this.parsingProgress.EXTRACTING_TEXT, 'Extracting text from document...');

      const text = await this.extractText(filePath, fileType);
      logger.info(`Extracted text length: ${text.length} characters`);

      // Update progress: Parsing name
      this.updateProgress(socket, clientId, this.parsingProgress.PARSING_NAME, 'Parsing personal information...');

      const resumeData = {
        name: this.extractName(text),
        email: this.extractEmail(text),
        phone: this.extractPhone(text),
        location: this.extractLocation(text),
        summary: this.extractSummary(text),
        skills: this.extractSkills(text),
        experience: this.extractExperience(text),
        education: this.extractEducation(text),
        projects: this.extractProjects(text),
        links: this.extractLinks(text),
        certifications: this.extractCertifications(text),
        languages: this.extractLanguages(text)
      };

      // Update progress: Complete
      this.updateProgress(socket, clientId, this.parsingProgress.COMPLETE, 'Resume parsing completed successfully!');

      logger.info('Resume parsing completed successfully');
      return resumeData;

    } catch (error) {
      logger.error('Resume parsing failed:', error);
      this.updateProgress(socket, clientId, 0, `Parsing failed: ${error.message}`);
      throw new Error(`Resume parsing failed: ${error.message}`);
    }
  }

  /**
   * Extract text from file based on type
   */
  async extractText(filePath, fileType) {
    try {
      const fileBuffer = await fs.readFile(filePath);

      if (fileType === 'pdf') {
        const data = await pdfParse(fileBuffer);
        return data.text;
      } else if (fileType === 'docx') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      logger.error(`Text extraction failed for ${fileType}:`, error);
      throw new Error(`Failed to extract text from ${fileType.toUpperCase()} file`);
    }
  }

  /**
   * Extract name from text
   */
  extractName(text) {
    const namePatterns = [
      // Look for name at the beginning of the document
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m,
      // Look for name after common headers
      /(?:Name|Full Name|Contact)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
      // Look for capitalized words at start
      /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].length > 3 && match[1].length < 50) {
        return match[1].trim();
      }
    }

    return '';
  }

  /**
   * Extract email from text
   */
  extractEmail(text) {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailPattern);
    return match ? match[0].toLowerCase() : '';
  }

  /**
   * Extract phone number from text
   */
  extractPhone(text) {
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g,
      /(\+?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})/g
    ];

    for (const pattern of phonePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        // Return the first valid phone number found
        for (const match of matches) {
          const cleanPhone = match.replace(/[^\d+\-\s()]/g, '').trim();
          if (cleanPhone.length >= 10) {
            return cleanPhone;
          }
        }
      }
    }

    return '';
  }

  /**
   * Extract location from text
   */
  extractLocation(text) {
    const locationPatterns = [
      /(?:Location|Address|City)[\s:]*([A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+)?)/i,
      /([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)/
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return '';
  }

  /**
   * Extract professional summary
   */
  extractSummary(text) {
    const summaryPatterns = [
      /(?:Summary|Objective|Profile|About)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:Experience|Skills|Education|Projects))/i,
      /(?:Summary|Objective|Profile|About)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:[A-Z][a-z]+))/i
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const summary = match[1].trim();
        if (summary.length > 20 && summary.length < 500) {
          return summary.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
        }
      }
    }

    return '';
  }

  /**
   * Extract skills from text
   */
  extractSkills(text) {
    const skills = new Set();

    // Common tech skills to look for
    const techSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'HTML', 'CSS', 'SASS', 'SCSS', 'Tailwind', 'Bootstrap', 'Material-UI',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'Linux', 'Agile', 'Scrum', 'CI/CD', 'Jenkins', 'GitHub Actions'
    ];

    // Look for skills section
    const skillsSectionPattern = /(?:Skills|Technical Skills|Technologies)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:Experience|Education|Projects|Work|Professional))/i;
    const skillsMatch = text.match(skillsSectionPattern);

    if (skillsMatch && skillsMatch[1]) {
      const skillsText = skillsMatch[1];

      // Extract skills from the skills section
      for (const skill of techSkills) {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi');
        if (regex.test(skillsText)) {
          skills.add(skill);
        }
      }

      // Also look for comma or bullet separated skills
      const skillItems = skillsText.split(/[,\n•\-*]/).map(s => s.trim());
      for (const item of skillItems) {
        if (item.length > 1 && item.length < 30 && !item.includes(' ')) {
          skills.add(item);
        }
      }
    }

    return Array.from(skills).slice(0, 20); // Limit to 20 skills
  }

  /**
   * Extract work experience
   */
  extractExperience(text) {
    const experience = [];
    const experiencePattern = /(?:Experience|Work Experience|Professional Experience|Employment)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:Education|Skills|Projects))/i;

    const match = text.match(experiencePattern);
    if (match && match[1]) {
      const expText = match[1];

      // Split by common job separators
      const jobBlocks = expText.split(/(?=^[A-Z][a-zA-Z\s,&]+(?:\s*-\s*[A-Z][a-zA-Z\s,&]+)?$)/m);

      for (const block of jobBlocks.slice(0, 5)) { // Limit to 5 experiences
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);

        if (lines.length >= 2) {
          const job = {
            title: lines[0] || '',
            company: lines[1] || '',
            duration: '',
            description: lines.slice(2).join(' ').substring(0, 300)
          };

          // Try to extract duration
          const durationMatch = block.match(/(\w+\s+\d{4}\s*-\s*(?:\w+\s+\d{4}|Present|Current))/i);
          if (durationMatch) {
            job.duration = durationMatch[1];
          }

          if (job.title && job.company) {
            experience.push(job);
          }
        }
      }
    }

    return experience;
  }

  /**
   * Extract education
   */
  extractEducation(text) {
    const education = [];
    const educationPattern = /(?:Education|Academic Background|Qualifications)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:Experience|Skills|Projects))/i;

    const match = text.match(educationPattern);
    if (match && match[1]) {
      const eduText = match[1];

      // Split by degree keywords
      const degreeBlocks = eduText.split(/(?=(?:Bachelor|Master|PhD|Doctorate|Associate|Certificate|B\.|M\.|Ph\.D\.))/i);

      for (const block of degreeBlocks.slice(0, 3)) { // Limit to 3 education entries
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);

        if (lines.length >= 2) {
          const edu = {
            degree: lines[0] || '',
            institution: lines[1] || '',
            year: '',
            gpa: ''
          };

          // Try to extract year
          const yearMatch = block.match(/(\d{4})/);
          if (yearMatch) {
            edu.year = yearMatch[1];
          }

          // Try to extract GPA
          const gpaMatch = block.match(/GPA[\s:]*([\d.]+)/i);
          if (gpaMatch) {
            edu.gpa = gpaMatch[1];
          }

          if (edu.degree && edu.institution) {
            education.push(edu);
          }
        }
      }
    }

    return education;
  }

  /**
   * Extract projects
   */
  extractProjects(text) {
    const projects = [];
    const projectsPattern = /(?:Projects|Personal Projects|Portfolio)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:Experience|Education|Skills))/i;

    const match = text.match(projectsPattern);
    if (match && match[1]) {
      const projText = match[1];

      // Split by project separators
      const projectBlocks = projText.split(/(?=^[A-Z][a-zA-Z\s,&]+(?:\s*-\s*[A-Z][a-zA-Z\s,&]+)?$)/m);

      for (const block of projectBlocks.slice(0, 5)) { // Limit to 5 projects
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);

        if (lines.length >= 1) {
          const project = {
            title: lines[0] || '',
            description: lines.slice(1).join(' ').substring(0, 200),
            technologies: [],
            githubUrl: '',
            liveUrl: ''
          };

          // Try to extract URLs
          const urlMatch = block.match(/(?:https?:\/\/[^\s]+)/g);
          if (urlMatch) {
            for (const url of urlMatch) {
              if (url.includes('github.com')) {
                project.githubUrl = url;
              } else {
                project.liveUrl = url;
              }
            }
          }

          // Try to extract technologies
          const techMatch = block.match(/(?:Technologies|Tech|Stack)[\s:]*([^\n]+)/i);
          if (techMatch && techMatch[1]) {
            project.technologies = techMatch[1].split(/[,\s]+/).filter(t => t.length > 1).slice(0, 5);
          }

          if (project.title) {
            projects.push(project);
          }
        }
      }
    }

    return projects;
  }

  /**
   * Extract links
   */
  extractLinks(text) {
    const links = [];
    const urlPattern = /https?:\/\/[^\s]+/g;
    const matches = text.match(urlPattern);

    if (matches) {
      for (const url of matches.slice(0, 5)) { // Limit to 5 links
        if (url.includes('linkedin.com') || url.includes('github.com') || url.includes('twitter.com')) {
          links.push(url);
        }
      }
    }

    return links;
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certifications = [];
    const certPattern = /(?:Certifications?|Certificates?)[\s:]*\n?((?:.|\n)*?)(?:\n\s*(?:Experience|Education|Skills))/i;

    const match = text.match(certPattern);
    if (match && match[1]) {
      const certText = match[1];
      const certLines = certText.split('\n').map(l => l.trim()).filter(l => l && l.length > 3);

      for (const cert of certLines.slice(0, 5)) { // Limit to 5 certifications
        certifications.push(cert);
      }
    }

    return certifications;
  }

  /**
   * Extract languages
   */
  extractLanguages(text) {
    const languages = [];
    const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Portuguese'];

    for (const lang of commonLanguages) {
      const regex = new RegExp(`\\b${lang}\\b`, 'gi');
      if (regex.test(text)) {
        languages.push(lang);
      }
    }

    return languages.slice(0, 3); // Limit to 3 languages
  }

  /**
   * Update parsing progress via Socket.IO
   */
  updateProgress(socket, clientId, progress, message) {
    if (socket && clientId) {
      socket.to(`upload-${clientId}`).emit('resume-parsing-progress', {
        progress,
        message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new ResumeParserService();