const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(filePath) {
  try {
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(filePath) {
  try {
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
}

/**
 * Parse resume text and extract structured data
 */
function parseResumeText(text) {
  const resume = {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    summary: extractSummary(text),
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    projects: extractProjects(text),
    links: extractLinks(text)
  };

  return resume;
}

/**
 * Extract name (usually first line or near top)
 */
function extractName(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Look for common patterns
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Filter out common non-name patterns
    if (!line.includes('@') && !line.includes('http') && line.length < 50 && /^[A-Z]/.test(line)) {
      return line;
    }
  }
  
  return 'John Doe';
}

/**
 * Extract email
 */
function extractEmail(text) {
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  return emailMatch ? emailMatch[1] : 'email@example.com';
}

/**
 * Extract phone number
 */
function extractPhone(text) {
  const phonePatterns = [
    /\+?91[-.\s]?[6-9]\d{9}/,
    /\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\+?\d{1,3}[-.\s]?\d{1,14}/
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }

  return '+91 XXXXXXXXXX';
}

/**
 * Extract location
 */
function extractLocation(text) {
  const locationKeywords = ['location:', 'based in', 'city:', 'address:'];
  const lines = text.split('\n');

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const keyword of locationKeywords) {
      if (lowerLine.includes(keyword)) {
        return line.replace(new RegExp(keyword, 'i'), '').trim();
      }
    }
  }

  return 'City, Country';
}

/**
 * Extract professional summary
 */
function extractSummary(text) {
  const summaryKeywords = ['summary', 'professional summary', 'about', 'objective'];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    for (const keyword of summaryKeywords) {
      if (line.includes(keyword)) {
        // Collect next 2-3 lines as summary
        let summary = '';
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          if (lines[j].trim() && !lines[j].match(/^[A-Z\s]+$/)) {
            summary += lines[j].trim() + ' ';
          }
        }
        return summary.trim() || 'Experienced professional with diverse skills.';
      }
    }
  }

  return 'Experienced professional with diverse skills.';
}

/**
 * Extract skills
 */
function extractSkills(text) {
  const skillsKeywords = ['skills', 'technical skills', 'core competencies'];
  const lines = text.split('\n');
  const skills = {};

  let inSkillsSection = false;
  const commonCategories = ['programming', 'database', 'web', 'tools', 'professional'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    // Check if we're in skills section
    if (skillsKeywords.some(keyword => line.includes(keyword))) {
      inSkillsSection = true;
      continue;
    }

    // Stop if we hit another major section
    if (inSkillsSection && /^(experience|education|projects|certifications)/i.test(line)) {
      break;
    }

    if (inSkillsSection && lines[i].trim()) {
      const trimmedLine = lines[i].trim();
      
      // Check if it's a category
      const category = commonCategories.find(cat => trimmedLine.toLowerCase().includes(cat));
      
      if (category) {
        // Extract skills after colon
        const parts = trimmedLine.split(':');
        if (parts.length > 1) {
          skills[category] = parts[1].trim();
        }
      } else if (trimmedLine && !trimmedLine.match(/^[A-Z\s]+$/)) {
        // Add as a general skill
        if (!skills.programming) skills.programming = '';
        skills.programming += (skills.programming ? ', ' : '') + trimmedLine;
      }
    }
  }

  // If no skills found, return defaults
  if (Object.keys(skills).length === 0) {
    skills.programming = 'JavaScript, React, Node.js';
    skills.database = 'SQL, MongoDB';
    skills.tools = 'Git, VS Code';
  }

  return skills;
}

/**
 * Extract work experience
 */
function extractExperience(text) {
  const experiences = [];
  const lines = text.split('\n');
  let inExperienceSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes('experience') || line.includes('work history')) {
      inExperienceSection = true;
      continue;
    }

    if (inExperienceSection) {
      if (/^(education|projects|skills|certifications)/i.test(line)) break;

      // Look for job titles (usually have dates or company names)
      if (lines[i].trim() && /\d{4}/.test(lines[i])) {
        const experience = {
          title: lines[i].split('|')[0]?.trim() || lines[i].trim(),
          company: lines[i].split('|')[1]?.trim() || '',
          duration: extractDateRange(lines[i]),
          points: []
        };

        // Collect job description lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const descLine = lines[j].trim();
          if (descLine && !descLine.match(/^\d/) && !descLine.toLowerCase().includes('experience')) {
            experience.points.push(descLine);
          }
        }

        experiences.push(experience);
      }
    }
  }

  return experiences.length > 0 ? experiences : [{
    title: 'Position',
    company: 'Company Name',
    duration: '2024 - Present',
    points: ['Responsibility 1', 'Responsibility 2']
  }];
}

/**
 * Extract education
 */
function extractEducation(text) {
  const education = [];
  const lines = text.split('\n');
  let inEducationSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes('education')) {
      inEducationSection = true;
      continue;
    }

    if (inEducationSection) {
      if (/^(experience|projects|skills)/i.test(line)) break;

      // Look for degree patterns
      if (/bachelor|master|phd|bca|btech|mca|degree/i.test(lines[i])) {
        const degree = {
          degree: lines[i].trim(),
          institution: lines[i + 1]?.trim() || 'University',
          duration: extractDateRange(lines[i + 1] || lines[i]),
          status: 'Completed'
        };

        education.push(degree);
      }
    }
  }

  return education.length > 0 ? education : [{
    degree: 'Bachelor of Science',
    institution: 'University Name',
    duration: '2020 - 2024',
    status: 'Completed'
  }];
}

/**
 * Extract projects
 */
function extractProjects(text) {
  const projects = [];
  const lines = text.split('\n');
  let inProjectsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    if (line.includes('project')) {
      inProjectsSection = true;
      continue;
    }

    if (inProjectsSection) {
      if (/^(experience|education|skills)/i.test(line)) break;

      // Look for project titles
      if (lines[i].trim() && !lines[i].match(/^\s*-|^\s*•/)) {
        const project = {
          title: lines[i].trim(),
          description: lines[i + 1]?.trim() || 'Project description',
          tech: extractTechStack(lines.slice(i, i + 3).join(' ')),
          github: extractUrl(lines.slice(i, i + 3).join(' '), 'github') || '',
          link: extractUrl(lines.slice(i, i + 3).join(' '), 'http') || ''
        };

        projects.push(project);
      }
    }
  }

  return projects.length > 0 ? projects : [{
    title: 'Sample Project',
    description: 'Project description',
    tech: 'React, Node.js',
    github: '',
    link: ''
  }];
}

/**
 * Extract links (GitHub, LinkedIn, Portfolio, etc.)
 */
function extractLinks(text) {
  const links = {};
  
  const urlPatterns = {
    github: /(https?:\/\/)?(www\.)?github\.com\/[\w-]+/i,
    linkedin: /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+/i,
    portfolio: /(https?:\/\/)?[\w-]+\.\w+/i,
  };

  for (const [type, pattern] of Object.entries(urlPatterns)) {
    const match = text.match(pattern);
    if (match) {
      links[type] = match[0].includes('http') ? match[0] : `https://${match[0]}`;
    }
  }

  return links;
}

/**
 * Helper: Extract tech stack from text
 */
function extractTechStack(text) {
  const techKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Vue', 'Angular',
    'Node.js', 'Express', 'Django', 'Flask', 'MongoDB', 'PostgreSQL', 'MySQL',
    'AWS', 'Docker', 'Git', 'HTML', 'CSS', 'Tailwind', 'Bootstrap'
  ];

  const found = techKeywords.filter(tech => new RegExp(tech, 'i').test(text));
  return found.length > 0 ? found.join(', ') : 'React, Node.js';
}

/**
 * Helper: Extract URL
 */
function extractUrl(text, type = 'http') {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlPattern) || [];
  
  if (type === 'github') {
    return urls.find(url => url.includes('github')) || '';
  }
  
  return urls[0] || '';
}

/**
 * Helper: Extract date range
 */
function extractDateRange(text) {
  const datePattern = /(\d{4})\s*-?\s*(?:(present|current|now)|(\d{4}))?/i;
  const match = text.match(datePattern);
  
  if (match) {
    const startYear = match[1];
    const endYear = match[3] || (match[2] ? 'Present' : new Date().getFullYear());
    return `${startYear} - ${endYear}`;
  }
  
  return 'Date not specified';
}

/**
 * Main resume parsing function
 */
async function parseResume(filePath, fileType) {
  try {
    let text = '';

    if (fileType === 'pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (fileType === 'docx') {
      text = await extractTextFromDOCX(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    const parsedResume = parseResumeText(text);
    return parsedResume;
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}

module.exports = {
  parseResume,
  parseResumeText,
  extractTextFromPDF,
  extractTextFromDOCX
};
